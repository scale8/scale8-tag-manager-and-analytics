import { injectable } from 'inversify';
import Manager from '../../abstractions/Manager';
import { gql } from 'apollo-server-express';
import CTX from '../../gql/ctx/CTX';
import { ObjectId, ObjectID } from 'mongodb';
import ScalarContainer from '../../mongo/custom/ScalarContainer';
import GQLError from '../../errors/GQLError';
import IngestEndpointDataMap from '../../mongo/models/data/IngestEndpointDataMap';
import IngestEndpointRevision from '../../mongo/models/data/IngestEndpointRevision';
import userMessages from '../../errors/UserMessages';
import { deleteModelCascading } from '../../utils/ModelUtils';
import {
    createIngestEndpointDataMapSchemasFromGQLInput,
    getDefaultValue,
} from '../../utils/IngestEndpointDataMapUtils';
import { VarType } from '../../enums/VarType';
import { withUnManagedAccount } from '../../utils/DataManagerAccountUtils';

@injectable()
export default class IngestEndpointDataMapManager extends Manager<IngestEndpointDataMap> {
    protected gqlSchema = gql`
        """
        @model
        A validation rule to be associated with an \`IngestEndpointDataMap\`.
        """
        type IngestEndpointDataMapValidation {
            """
            Validation type
            """
            type: ValidationType!
            """
            Input value to check against
            """
            input_value: DataMapValue
        }

        """
        @model
        This entity maps key-value properties together. It is able to hold child key-value pairs in a recursive structure. This is used directly by the \`IngestEndpoint\` to hold all the key-value mappings required to structure the desired payload.
        """
        type IngestEndpointDataMap {
            """
            ID of the \`IngestEndpointDataMap\`
            """
            id: ID!
            """
            Key (Property Key) of the \`IngestEndpointDataMap\`
            """
            key: String!
            """
            Variable type (see \`VarType\`)
            """
            var_type: String!
            """
            The default value. If no input is provided for this property, then the default value will be applied automatically
            """
            default_value: DefaultValue
            """
            If the variable type (see \`VarType\`) has been specified as an object or array of objects, then this contains the child property definitions
            """
            child_ingest_endpoint_data_maps: [IngestEndpointDataMap!]!
            """
            Whether or not the property is optional or not
            """
            is_optional: Boolean!
            """
            A list of validation rules associated with this \`IngestEndpointDataMap\`.
            """
            validation_rules: [IngestEndpointDataMapValidation!]
        }

        input IngestEndpointDataMapValidationInput {
            """
            Validation type
            """
            type: ValidationType!
            """
            Input value to check against
            """
            input_value: DataMapValue
        }

        input IngestEndpointDataMapInput {
            """
            \`IngestEndpointDataMap\` property key
            """
            key: String!
            """
            \`IngestEndpointDataMap\` variable type (see \`VarType\`)
            """
            var_type: VarType!
            """
            The default value associated with this key-value pair. (optional)
            """
            default_value: DataMapValue
            """
            A list of default values associated with this key-value pair. (optional)
            """
            default_values: [DataMapValue!]
            """
            A fully recurisve structure, this is used to acheive 'Object' and 'Array of Object' type structures
            """
            child_ingest_endpoint_data_maps: [IngestEndpointDataMapInput!]
            """
            Whether or not the \`IngestEndpointDataMap\` is optional
            """
            optional: Boolean = false
            """
            Optional validation rules
            """
            validation_rules: [IngestEndpointDataMapValidationInput!]
        }

        input IngestEndpointDataMapUpdateInput {
            """
            \`IngestEndpointDataMap\` ID
            """
            ingest_endpoint_data_map_id: ID!
            """
            If true, this remove the default value
            """
            remove_default_value: Boolean
            """
            The default value associated with this key-value pair. (optional)
            """
            default_value: DataMapValue
            """
            A list of default values associated with this key-value pair. (optional)
            """
            default_values: [DataMapValue!]
            """
            Whether or not the \`IngestEndpointDataMap\` is optional
            """
            optional: Boolean
            """
            Optional validation rules
            """
            validation_rules: [IngestEndpointDataMapValidationInput!]
        }

        input AddChildrenIngestEndpointDataMapsInput {
            """
            \`IngestEndpointDataMap\` ID to add new child \`IngestEndpointDataMap\` against
            """
            ingest_endpoint_data_map_id: ID!
            """
            A list of new \`IngestEndpointDataMap\` to create under the parent
            """
            ingest_endpoint_data_maps: [IngestEndpointDataMapInput!]!
        }

        input DeleteChildIngestEndpointDataMapInput {
            """
            \`IngestEndpointDataMap\` ID to delete against
            """
            ingest_endpoint_data_map_id: ID!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=IngestEndpointDataMap
            Update an \`IngestEndpointDataMap\`
            """
            updateIngestEndpointDataMap(
                ingestEndpointDataMapUpdateInput: IngestEndpointDataMapUpdateInput
            ): Boolean!
            """
            @bound=IngestEndpointDataMap
            Add a new child \`IngestEndpointDataMap\` to a parent \`IngestEndpointDataMap\`
            """
            addChildrenIngestEndpointDataMaps(
                addChildrenIngestEndpointDataMapsInput: AddChildrenIngestEndpointDataMapsInput
            ): [IngestEndpointDataMap!]!
            """
            @bound=IngestEndpointDataMap
            Delete an \`IngestEndpointDataMap\` and all child relationships beneath it
            """
            deleteIngestEndpointDataMap(
                deleteChildIngestEndpointDataMapInput: DeleteChildIngestEndpointDataMapInput
            ): [ModelDeleteAcknowledgement!]!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=IngestEndpointDataMap
            """
            getIngestEndpointDataMap(id: ID!): IngestEndpointDataMap!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getIngestEndpointDataMap: async (parent: any, args: any, ctx: CTX) => {
            const ingestEndpointDataMap = await this.repoFactory(
                IngestEndpointDataMap,
            ).findByIdThrows(new ObjectID(args.id), userMessages.dataMapFailed);
            return await this.orgAuth.asUserWithViewAccess(
                ctx,
                ingestEndpointDataMap.orgId,
                async () => ingestEndpointDataMap.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        updateIngestEndpointDataMap: async (parent: any, args: any, ctx: CTX) => {
            const data = args.ingestEndpointDataMapUpdateInput;
            const ingestEndpointDataMap = await this.repoFactory(
                IngestEndpointDataMap,
            ).findByIdThrows(
                new ObjectId(data.ingest_endpoint_data_map_id),
                userMessages.dataMapFailed,
            );
            return withUnManagedAccount(ingestEndpointDataMap.dataManagerAccountId, async () =>
                this.orgAuth.asUserWithEditAccess(ctx, ingestEndpointDataMap.orgId, async (me) => {
                    if (typeof data.optional === 'boolean') {
                        ingestEndpointDataMap.isOptional = data.optional;
                    }
                    const defaultValue = getDefaultValue(data.default_value, data.default_values);
                    if (data.remove_default_value === true) {
                        ingestEndpointDataMap.defaultValue = undefined;
                    } else if (defaultValue !== undefined) {
                        ingestEndpointDataMap.defaultValue = defaultValue;
                    }
                    if (Array.isArray(data.validation_rules)) {
                        ingestEndpointDataMap.validations = data.validation_rules;
                    }
                    await this.repoFactory(IngestEndpointDataMap).save(ingestEndpointDataMap, me);
                    return true;
                }),
            );
        },
        addChildrenIngestEndpointDataMaps: async (parent: any, args: any, ctx: CTX) => {
            const data = args.addChildrenIngestEndpointDataMapsInput;
            const ingestEndpointDataMap = await this.repoFactory(
                IngestEndpointDataMap,
            ).findByIdThrows(
                new ObjectId(data.ingest_endpoint_data_map_id),
                userMessages.dataMapFailed,
            );
            return withUnManagedAccount(ingestEndpointDataMap.dataManagerAccountId, async () =>
                this.orgAuth.asUserWithCreateAccess(
                    ctx,
                    ingestEndpointDataMap.orgId,
                    async (me) => {
                        if (
                            ingestEndpointDataMap.varType === VarType.OBJECT ||
                            ingestEndpointDataMap.varType === VarType.ARRAY_OBJECT
                        ) {
                            const ingestEndpointDataMaps =
                                await createIngestEndpointDataMapSchemasFromGQLInput(
                                    me,
                                    ingestEndpointDataMap,
                                    data.ingest_endpoint_data_maps,
                                );
                            //return the new ingestEndpoint data maps...
                            return ingestEndpointDataMaps.map((_) => _.toGQLType());
                        } else {
                            throw new GQLError(userMessages.endpointNoChildren, true);
                        }
                    },
                ),
            );
        },
        deleteIngestEndpointDataMap: async (parent: any, args: any, ctx: CTX) => {
            const data = args.deleteChildIngestEndpointDataMapInput;
            const ingestEndpointDataMap = await this.repoFactory(
                IngestEndpointDataMap,
            ).findByIdThrows(
                new ObjectId(data.ingest_endpoint_data_map_id),
                userMessages.dataMapFailed,
            );
            return withUnManagedAccount(ingestEndpointDataMap.dataManagerAccountId, async () =>
                this.orgAuth.asUserWithDeleteAccess(
                    ctx,
                    ingestEndpointDataMap.orgId,
                    async (me) => {
                        //first look at IngestEndpointRevision and unlink where applicable...
                        const ingestEndpointRevision = await this.repoFactory(
                            IngestEndpointRevision,
                        ).findByIdThrows(
                            ingestEndpointDataMap.ingestEndpointRevisionId,
                            userMessages.revisionFailed,
                        );
                        ingestEndpointRevision.ingestEndpointDataMapIds =
                            ingestEndpointRevision.ingestEndpointDataMapIds.filter(
                                (_) => !_.equals(ingestEndpointDataMap.id),
                            );
                        await this.repoFactory(IngestEndpointRevision).save(
                            ingestEndpointRevision,
                            me,
                        );
                        //next do a search on IngestEndpointDataMap
                        const ingestEndpointDataMaps = await this.repoFactory(
                            IngestEndpointDataMap,
                        ).find({
                            _child_ingest_endpoint_data_map_ids: ingestEndpointDataMap.id,
                        });
                        //todo... this needs to be better...
                        await Promise.all(
                            ingestEndpointDataMaps.map(async (_) => {
                                _.childIngestEndpointDataMapIds =
                                    _.childIngestEndpointDataMapIds.filter(
                                        (_) => !_.equals(ingestEndpointDataMap.id),
                                    );
                                await this.repoFactory(IngestEndpointDataMap).save(_, me);
                            }),
                        );
                        //ok, all unlinked, now delete the parent and do this cascading...
                        return await deleteModelCascading(me, ingestEndpointDataMap);
                    },
                ),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        IngestEndpointDataMap: {
            default_value: async (parent: any, args: any, ctx: CTX) => {
                const ingestEndpointDataMap = await this.repoFactory(
                    IngestEndpointDataMap,
                ).findByIdThrows(new ObjectID(parent.id), userMessages.dataMapFailed);
                return this.orgAuth.asUserWithViewAccess(
                    ctx,
                    ingestEndpointDataMap.orgId,
                    async () => {
                        const defaultValue = ingestEndpointDataMap.defaultValue;
                        if (defaultValue === undefined) {
                            return undefined;
                        } else if (defaultValue instanceof ScalarContainer) {
                            return { values: defaultValue.arr };
                        } else {
                            return { value: defaultValue };
                        }
                    },
                );
            },
            child_ingest_endpoint_data_maps: async (parent: any, args: any, ctx: CTX) => {
                const ingestEndpointDataMap = await this.repoFactory(
                    IngestEndpointDataMap,
                ).findByIdThrows(new ObjectID(parent.id), userMessages.dataMapFailed);
                return this.orgAuth.asUserWithViewAccess(
                    ctx,
                    ingestEndpointDataMap.orgId,
                    async () => {
                        return (
                            await this.repoFactory(IngestEndpointDataMap).findByIds(
                                ingestEndpointDataMap.childIngestEndpointDataMapIds,
                            )
                        ).map((_) => _.toGQLType());
                    },
                );
            },
            validation_rules: async (parent: any, args: any, ctx: CTX) => {
                const ingestEndpointDataMap = await this.repoFactory(
                    IngestEndpointDataMap,
                ).findByIdThrows(new ObjectID(parent.id), userMessages.dataMapFailed);
                return this.orgAuth.asUserWithViewAccess(
                    ctx,
                    ingestEndpointDataMap.orgId,
                    async () => ingestEndpointDataMap.validations,
                );
            },
        },
    };
}
