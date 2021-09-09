import { injectable } from 'inversify';
import Manager from '../../abstractions/Manager';
import { gql } from 'apollo-server-express';
import PlatformDataMap from '../../mongo/models/tag/PlatformDataMap';
import CTX from '../../gql/ctx/CTX';
import { ObjectID } from 'mongodb';
import ScalarContainer from '../../mongo/custom/ScalarContainer';
import PlatformRevision from '../../mongo/models/tag/PlatformRevision';
import Platform from '../../mongo/models/tag/Platform';
import userMessages from '../../errors/UserMessages';

@injectable()
export default class PlatformDataMapManager extends Manager<PlatformDataMap> {
    protected gqlSchema = gql`
        """
        @model
        """
        type PlatformDataMapValidation {
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
        """
        type PlatformDataMap {
            """
            ID of the \`PlatformDataMap\`
            """
            id: ID!
            """
            Persisting ID, this reference will stay the same across all revisions of this entity
            """
            persisting_id: String!
            """
            Icon
            """
            icon: TypeIcon
            """
            \`Platform\` that contains this \`PlatformDataMap\`
            """
            platform: Platform!
            """
            \`PlatformRevision\` that contains this \`PlatformDataMap\`
            """
            platform_revision: PlatformRevision!
            """
            Key (Property Key) of the \`PlatformDataMap\`
            """
            key: String!
            """
            Description of the \`PlatformDataMap\`
            """
            description: String!
            """
            See \`InputType\`
            """
            input_type: InputType!
            """
            See \`VarType\`
            """
            var_type: VarType!
            """
            Default value - used when \`PlatformDataMap\` has been created as optional and \`PlatformDataMap\` has not been implemented
            """
            default_value: DefaultValue
            """
            Option value - used when \`PlatformDataMap\` is a SELECT or RADIO \`InputType\` to provide a complete list of values to choose from
            """
            option_values: [DataMapValue!]
            """
            Child platform data maps are used with OBJECT and ARRAY_OBJECT types. These contain nested \`PlatformDataMap\` in a document or array document structure respectivly
            """
            child_platform_data_maps: [PlatformDataMap!]!
            """
            If this value is optional or not. If the value is optional then this \`PlatformDataMap\` must be implemented correctly.
            """
            is_optional: Boolean!
            """
            A list of validation rules associated with this \`PlatformDataMap\`.
            """
            validation_rules: [PlatformDataMapValidation!]
        }

        input PlatformDataMapValidationInput {
            """
            Validation type
            """
            type: ValidationType!
            """
            Input value to check against
            """
            input_value: DataMapValue
        }

        input PlatformDataMapInput {
            """
            The persistence id associated with this \`PlatformDataMap\`. This ID should be unique to the action, however it can be shared across \`PlatformRevision\`s. We will provide a difference between two \`PlatformRevision\`s when they have the same persistence id.
            """
            persistence_id: String!
            """
            The key of the new \`PlatformDataMap\`
            """
            key: String!
            """
            Description
            """
            description: String = "A description has not been provided"
            """
            (See \`InputType\`)
            """
            input_type: InputType!
            """
            An optional default value to be applied when the value from the data layer is not retrievable
            """
            default_value: DataMapValue
            """
            An optional list of default values to be applied when the value from the data layer is not retrievable
            """
            default_values: [DataMapValue!]
            """
            An optional list of values to be used with SELECT or RADIO \`InputType\`
            """
            option_values: [DataMapValue!]
            """
            If \`VarType\` is an OBJECT or ARRAY_OBJECT then it may contain child key => value pairs.
            """
            child_platform_data_maps: [PlatformDataMapInput!]
            """
            Whether or not this \`PlatformDataMap\` is optional. We will flag missing data in debug mode (console).
            """
            optional: Boolean
            """
            Optional Icon
            """
            icon: TypeIcon
            """
            Optional validation rules
            """
            validation_rules: [PlatformDataMapValidationInput!]
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        PlatformDataMap: {
            platform: async (parent: any, args: any, ctx: CTX) => {
                const platformDataMap = await this.repoFactory(PlatformDataMap).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.dataMapFailed,
                );
                const platform = await this.repoFactory(Platform).findByIdThrows(
                    platformDataMap.platformId,
                    userMessages.platformFailed,
                );
                return await this.orgAuth.asUserWithViewAccessOnPlatform(ctx, platform, () =>
                    platform.toGQLType(),
                );
            },
            platform_revision: async (parent: any, args: any, ctx: CTX) => {
                const platformDataMap = await this.repoFactory(PlatformDataMap).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.dataMapFailed,
                );
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    platformDataMap.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return await this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    () => platformRevision.toGQLType(),
                );
            },
            default_value: async (parent: any, args: any, ctx: CTX) => {
                const platformDataMap = await this.repoFactory(PlatformDataMap).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.dataMapFailed,
                );
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    platformDataMap.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    async () => {
                        const defaultValue = platformDataMap.defaultValue;
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
            option_values: async (parent: any, args: any, ctx: CTX) => {
                const platformDataMap = await this.repoFactory(PlatformDataMap).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.dataMapFailed,
                );
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    platformDataMap.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    async () =>
                        platformDataMap.optionValues === undefined
                            ? undefined
                            : platformDataMap.optionValues.arr,
                );
            },
            child_platform_data_maps: async (parent: any, args: any, ctx: CTX) => {
                const platformDataMap = await this.repoFactory(PlatformDataMap).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.dataMapFailed,
                );
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    platformDataMap.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    async () =>
                        (
                            await this.repoFactory(PlatformDataMap).findByIds(
                                platformDataMap.childPlatformDataMapIds,
                            )
                        ).map((_) => _.toGQLType()),
                );
            },
            validation_rules: async (parent: any, args: any, ctx: CTX) => {
                const platformDataMap = await this.repoFactory(PlatformDataMap).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.dataMapFailed,
                );
                const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                    platformDataMap.platformRevisionId,
                    userMessages.revisionFailed,
                );
                return this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                    ctx,
                    platformRevision,
                    async () => platformDataMap.validations,
                );
            },
        },
    };
}
