import Manager from '../../abstractions/Manager';
import { injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import Event from '../../mongo/models/tag/Event';
import CTX from '../../gql/ctx/CTX';
import { ObjectId, ObjectID } from 'mongodb';
import PlatformEvent from '../../mongo/models/tag/PlatformEvent';
import Revision from '../../mongo/models/tag/Revision';
import GQLError from '../../errors/GQLError';
import DataMap from '../../mongo/models/tag/DataMap';
import PlatformDataMap from '../../mongo/models/tag/PlatformDataMap';
import PlatformRevision from '../../mongo/models/tag/PlatformRevision';
import Trigger from '../../mongo/models/tag/Trigger';
import OperationOwner from '../../enums/OperationOwner';
import GQLMethod from '../../enums/GQLMethod';
import { DataMapSchema, DataMapSchemaCheck } from '../../mongo/types/Types';
import userMessages from '../../errors/UserMessages';
import { deleteModelCascading } from '../../utils/ModelUtils';
import {
    createDataMapSchemasFromDataMapInput,
    createDataMapsFromSchemas,
    dataMapSchemasImplementsPlatformDataMaps,
} from '../../utils/DataMapsUtils';
import container from '../../container/IOC.config';
import RepoFromModelFactory from '../../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../../container/IOC.types';
import RevisionRepo from '../../mongo/repos/tag/RevisionRepo';

@injectable()
export default class EventManager extends Manager<Event> {
    protected gqlSchema = gql`
        """
        @type
        A container for custom event name
        """
        type CustomEvent {
            """
            The name of the event to listen for.
            """
            custom_name: String!
        }

        """
        @union
        Can either be a \`CustomEvent\` or \`PlatformEvent\`. See \`Event\`
        """
        union EventType = CustomEvent | PlatformEvent

        """
        @model
        """
        type Event {
            """
            The \`Event\` ID
            """
            id: ID!
            """
            The \`Event\` name
            """
            name: String!
            """
            Either a \`CustomEvent\` or \`PlatformEvent\`
            """
            event: EventType!
            """
            \`DataMap\`'s that implements the \`PlatformDataMap\` of the connected \`PlatformEvent\`
            """
            data_maps: [DataMap!]!
            """
            The period after which the event state should be cleared. -1 = Inactive, 0 = Immidately, > 0, after some time specified in milliseconds. This useful for events that need to be re-triggered within some period of time to pass the check stage.
            """
            clear_state_ms: Int!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=Event
            Get a \`Event\` model from the \`Event\` ID
            """
            getEvent(id: ID!): Event!
        }

        """
        Either 'browser_event' or 'platform_event_id' is required.
        """
        input EventCreateInput {
            """
            The \`Trigger\` under which the \`Event\` should be created
            """
            trigger_id: ID!
            """
            The name of the event
            """
            name: String
            """
            The custom browser event
            """
            browser_event: String
            """
            The \`PlatformEvent\` ID
            """
            platform_event_id: ID
            """
            An array of \`DataMapInput\` that will create corresponding \`DataMap\`'s and implement the \`PlatformDataMap\` of the connected \`PlatformEvent\`
            """
            data_maps: [DataMapInput!]!
            """
            The period after which the event state should be cleared. -1 = Inactive, 0 = Immidately, > 0, after some time specified in milliseconds.
            """
            clear_state_ms: Int = -1
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input EventUpdateInput {
            """
            \`Event\` ID to update against
            """
            event_id: ID!
            """
            The name of the event
            """
            name: String
            """
            An array of \`DataMapInput\` that will create corresponding \`DataMap\`'s and implement the \`PlatformDataMap\` of the connected \`PlatformEvent\`
            """
            data_maps: [DataMapInput!]
            """
            The period after which the event state should be cleared. -1 = Inactive, 0 = Immidately, > 0, after some time specified in milliseconds.
            """
            clear_state_ms: Int
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        input EventDeleteInput {
            """
            \`Event\` ID to delete against
            """
            event_id: ID!
            """
            Any additional user comments for the audit
            """
            comments: String
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=Event
            Update an \`Event\`.
            """
            updateEvent(eventUpdateInput: EventUpdateInput!): Boolean!
            """
            @bound=Event
            Create a new \`Event\`.
            """
            createEvent(eventCreateInput: EventCreateInput!): Event!
            """
            @bound=Event
            Delete an \`Event\` and its children.
            """
            deleteEvent(eventDeleteInput: EventDeleteInput!): [ModelDeleteAcknowledgement!]!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getEvent: async (parent: any, args: any, ctx: CTX) => {
            const event = await this.repoFactory(Event).findByIdThrows(
                new ObjectID(args.id),
                userMessages.eventFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(ctx, event.orgId, async () =>
                event.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        updateEvent: async (parent: any, args: any, ctx: CTX) => {
            const data = args.eventUpdateInput;
            const event = await this.repoFactory(Event).findByIdThrows(
                new ObjectId(data.event_id),
                userMessages.eventFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, event.orgId, async (me) => {
                event.bulkGQLSet(data, ['name', 'clear_state_ms']);
                if (data.data_maps !== undefined && typeof event.event !== 'string') {
                    //we have data maps and the event implements a platform event (not custom!)
                    const revision = await this.repoFactory(Revision).findByIdThrows(
                        event.revisionId,
                        userMessages.revisionFailed,
                    );
                    const platformEvent = await this.repoFactory(PlatformEvent).findByIdThrows(
                        event.event,
                        userMessages.eventFailed,
                    );
                    const dataMapSchemas: DataMapSchema[] = createDataMapSchemasFromDataMapInput(
                        data.data_maps,
                    );
                    const checks: DataMapSchemaCheck[] =
                        await dataMapSchemasImplementsPlatformDataMaps(
                            await this.repoFactory(PlatformDataMap).findByIds(
                                platformEvent.platformDataMapIds,
                            ),
                            dataMapSchemas,
                        );
                    if (checks.every((_) => _.valid)) {
                        const oldDataMaps = await this.repoFactory(DataMap).findByIds(
                            event.dataMapIds,
                        );
                        const newDataMaps = await createDataMapsFromSchemas(
                            me,
                            dataMapSchemas,
                            revision,
                        );
                        event.dataMapIds = newDataMaps.map((_) => _.id);
                        await this.repoFactory(Event).save(event, me, OperationOwner.USER, {
                            gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                            userComments: data.comments,
                        });
                        //remove old data maps...
                        await Promise.all(oldDataMaps.map((_) => deleteModelCascading(me, _)));
                    } else {
                        throw new GQLError(userMessages.eventUpdateInvalidDM, true);
                    }
                } else {
                    await this.repoFactory(Event).save(event, me, OperationOwner.USER, {
                        gqlMethod: GQLMethod.UPDATE_PROPERTIES,
                        userComments: data.comments,
                    });
                }
                return true;
            });
        },
        deleteEvent: async (parent: any, args: any, ctx: CTX) => {
            const data = args.eventDeleteInput;
            const event = await this.repoFactory(Event).findByIdThrows(
                new ObjectId(data.event_id),
                userMessages.eventFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(ctx, event.orgId, async (me) => {
                const trigger = await this.repoFactory(Trigger).findOneThrows(
                    {
                        _event_ids: event.id,
                    },
                    userMessages.triggerFailed,
                );
                trigger.eventIds = trigger.eventIds.filter((_) => !_.equals(event.id));
                await this.repoFactory(Trigger).save(trigger, me, OperationOwner.USER, {
                    gqlMethod: GQLMethod.DELETE_LINKED_ENTITY,
                    userComments: data.comments,
                    opConnectedModels: [event],
                });
                return await deleteModelCascading(me, event);
            });
        },
        createEvent: async (parent: any, args: any, ctx: CTX) => {
            const getValidPlatformEvents = async (revision: Revision): Promise<PlatformEvent[]> => {
                return await this.repoFactory(PlatformEvent).findByIds(
                    (
                        await this.repoFactory<RevisionRepo>(Revision).getValidPlatformRevisions(
                            revision,
                        )
                    )
                        .map((_) => _.platformEventIds)
                        .flat(),
                );
            };

            const getEvent = async (
                platformEventId?: string,
                browserEvent?: string,
            ): Promise<string | PlatformEvent> => {
                const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

                if (platformEventId !== undefined) {
                    return await repoFactory(PlatformEvent).findByIdThrows(
                        new ObjectID(platformEventId),
                        userMessages.eventFailed,
                    );
                } else if (typeof browserEvent === 'string') {
                    return browserEvent;
                } else {
                    throw new GQLError(userMessages.eventCreateInvalidInput, true);
                }
            };

            const data = args.eventCreateInput;
            const trigger = await this.repoFactory(Trigger).findByIdThrows(
                new ObjectId(data.trigger_id),
                userMessages.triggerFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, trigger.orgId, async (me) => {
                //create a new entity...
                const revision = await this.repoFactory(Revision).findByIdThrows(
                    trigger.revisionId,
                    userMessages.revisionFailed,
                );
                const event = await getEvent(data.platform_event_id, data.browser_event);
                if (typeof event !== 'string') {
                    if (
                        (await getValidPlatformEvents(revision)).find((_) =>
                            _.id.equals(event.id),
                        ) === undefined
                    ) {
                        throw new GQLError(userMessages.platformEventInvalid, true);
                    }
                }

                const getDataMaps = async (): Promise<DataMap[]> => {
                    if (typeof event === 'string') {
                        return [];
                    } else {
                        const dataMapSchemas: DataMapSchema[] =
                            createDataMapSchemasFromDataMapInput(data.data_maps);
                        const checks: DataMapSchemaCheck[] =
                            await dataMapSchemasImplementsPlatformDataMaps(
                                await this.repoFactory(PlatformDataMap).findByIds(
                                    event.platformDataMapIds,
                                ),
                                dataMapSchemas,
                            );
                        if (checks.every((_) => _.valid)) {
                            return createDataMapsFromSchemas(me, dataMapSchemas, revision);
                        } else {
                            throw new GQLError(userMessages.eventCreateInvalidDM, true);
                        }
                    }
                };
                const dataMaps = await getDataMaps();
                //create new event
                const newEvent = await this.repoFactory(Event).save(
                    new Event(revision, event, data.name, dataMaps, data.clear_state_ms),
                    me,
                    OperationOwner.USER,
                    {
                        gqlMethod: GQLMethod.CREATE,
                        userComments: data.comments,
                    },
                );
                //link this back to the parent entity...
                trigger.eventIds = [...trigger.eventIds, newEvent.id];
                await this.repoFactory(Trigger).save(trigger, me, OperationOwner.USER, {
                    gqlMethod: GQLMethod.ADD_LINKED_ENTITY,
                    opConnectedModels: [newEvent],
                });
                //finally return the new entity
                return newEvent.toGQLType();
            });
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        Event: {
            event: async (parent: any, args: any, ctx: CTX) => {
                const event = await this.repoFactory(Event).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.eventFailed,
                );
                if (typeof event.event === 'string') {
                    return { custom_name: event.event };
                } else {
                    const platformEvent = await this.repoFactory(PlatformEvent).findByIdThrows(
                        event.event,
                        userMessages.eventFailed,
                    );
                    const platformRevision = await this.repoFactory(
                        PlatformRevision,
                    ).findByIdThrows(platformEvent.platformRevisionId, userMessages.revisionFailed);
                    return this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                        ctx,
                        platformRevision,
                        () => platformEvent.toGQLType(),
                    );
                }
            },
            data_maps: async (parent: any, args: any, ctx: CTX) => {
                const event = await this.repoFactory(Event).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.eventFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, event.orgId, async () =>
                    (await this.repoFactory(DataMap).findByIds(event.dataMapIds)).map((_) =>
                        _.toGQLType(),
                    ),
                );
            },
        },
        EventType: {
            __resolveType: (obj: any) => {
                if (obj.custom_name !== undefined) {
                    return 'CustomEvent';
                } else if (obj.id !== undefined) {
                    return 'PlatformEvent';
                }
                return null;
            },
        },
    };
}
