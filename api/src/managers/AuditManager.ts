import Manager from '../abstractions/Manager';
import { injectable } from 'inversify';
import Audit from '../mongo/models/Audit';
import { gql } from 'apollo-server-express';
import CTX from '../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import OrgRole from '../mongo/models/OrgRole';
import User from '../mongo/models/User';
import GQLError from '../errors/GQLError';
import userMessages from '../errors/UserMessages';
import UserRepo from '../mongo/repos/UserRepo';

@injectable()
export default class AuditManager extends Manager<Audit> {
    protected gqlSchema = gql`
        """
        @model
        Contains the ID and Type of a model.
        Used by \`Audit\` to describe a model that is connected to an operation.
        """
        type OperationConnectedModel {
            """
            Model ID
            """
            id: ID!
            """
            Model Type
            """
            type: String!
        }

        """
        @model
        \`Audit\` contains the details of an operation performed on an entity.
        """
        type Audit {
            """
            Unique audit id for this operation
            """
            id: ID!
            """
            Person performing the operation, can be undefined if the system has performed the operation instead
            """
            user: OrgUser
            """
            Operation owner
            """
            owner: OperationOwner!
            """
            Entity on which the operation was performed
            """
            model_id: ID!
            """
            Name of the model
            """
            model: String!
            """
            Model's persisting id
            """
            model_persisting_id: String!
            """
            Model extends from
            """
            parent_model_ids: [ID!]!
            """
            Action Preformed
            """
            action: AuditAction!
            """
            Method in which the action was performed
            """
            method: GQLMethod!
            """
            Optional user comments linked to this operation
            """
            comments: String
            """
            Models directly connected to (or influenced by) this operation
            """
            connected_models: [OperationConnectedModel!]!
            """
            The date the \`Audit\` was created
            """
            created_at: DateTime!
        }
        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=Audit
            Get the history for all entities
            """
            getHistoryForEntities(
                """
                Any valid list of entity ids
                """
                entities: [ID!]!
            ): [Audit!]!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getHistoryForEntities: async (parent: any, args: any, ctx: CTX) => {
            const getAuditsForEntity = async (id: ObjectId): Promise<Audit[]> => {
                //get the audit history of this element...
                const audits = await this.repoFactory(Audit).find({
                    _model_id: id,
                });
                if (audits.length > 0) {
                    //we have audits...
                    const modelName = audits[0].model;
                    const model = await this.repoFactory(modelName).findByIdThrows(
                        id,
                        userMessages.auditFailed,
                    );
                    //solve for 2 possible cases... cloned an non-cloned...
                    if (model.cloneMaps === undefined) {
                        return audits;
                    } else {
                        // noinspection JSUnusedGlobalSymbols
                        // we need the history of all previous clones...
                        const query = {
                            $or: model.cloneMaps.arr.map((cloneMap: string) => {
                                const [id, date] = cloneMap.split('/');
                                return {
                                    _model_id: new ObjectId(id),
                                    _created_at: { $lte: new Date(date) },
                                };
                            }),
                        };
                        return [...audits, ...(await this.repoFactory(Audit).find(query))];
                    }
                }
                return [];
            };

            const entityIds: string[] = args.entities;
            const audits: Audit[] = (
                await Promise.all(
                    entityIds.map((entityId) => getAuditsForEntity(new ObjectId(entityId))),
                )
            ).flat();
            if (audits.length > 0) {
                const orgId = audits[0].orgId;
                if (audits.every((_) => _.orgId.equals(orgId))) {
                    return await this.orgAuth.asUserWithViewAccess(ctx, orgId, () =>
                        audits
                            .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
                            .map((_) => _.toGQLType()),
                    );
                } else {
                    throw new GQLError(userMessages.auditHistoryOtherOrg, true);
                }
            } else {
                throw new GQLError(userMessages.auditHistoryFailed, true);
            }
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        Audit: {
            user: async (parent: any, args: any, ctx: CTX) => {
                const audit = await this.repoFactory(Audit).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.auditFailed,
                );
                if (audit.actor === 'SYSTEM') {
                    return null;
                } else {
                    const actorId = audit.actor;
                    return await this.orgAuth.asUserWithViewAccess(ctx, audit.orgId, async () => {
                        const orgRole = await this.repoFactory(OrgRole).findOne({
                            _user_id: actorId,
                            _org_id: audit.orgId,
                        });
                        if (orgRole === null) {
                            return null; //user could have been deleted, or removed from org etc.
                        } else {
                            const user = await this.repoFactory(User).findByIdThrows(
                                actorId,
                                userMessages.userFailed,
                            );
                            return this.repoFactory<UserRepo>(User).convertToOrgUser(
                                user,
                                audit.orgId,
                            );
                        }
                    });
                }
            },
            connected_models: async (parent: any, args: any, ctx: CTX) => {
                const audit = await this.repoFactory(Audit).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.auditFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, audit.orgId, () =>
                    audit.opConnectedModels.arr.map((_) => {
                        const [id, model] = _.split('/');
                        return {
                            id: id,
                            type: model,
                        };
                    }),
                );
            },
        },
    };
}
