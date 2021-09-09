import { injectable } from 'inversify';
import Manager from '../../abstractions/Manager';
import { gql } from 'apollo-server-express';
import CTX from '../../gql/ctx/CTX';
import { ObjectID } from 'mongodb';
import PlatformRevision from '../../mongo/models/tag/PlatformRevision';
import PlatformActionPermission from '../../mongo/models/tag/PlatformActionPermission';
import userMessages from '../../errors/UserMessages';

@injectable()
export default class PlatformActionPermissionManager extends Manager<PlatformActionPermission> {
    protected gqlSchema = gql`
        """
        @model
        """
        type VariableReadWriteExecuteScope {
            """
            Variable name
            """
            name: String!
            """
            Can read variable?
            """
            read: Boolean!
            """
            Can modify variable?
            """
            write: Boolean!
            """
            Can execute variable?
            """
            execute: Boolean!
        }

        """
        @model
        """
        type PlatformActionPermission {
            """
            ID of the \`PlatformActionPermission\`
            """
            id: ID!
            """
            Persisting ID, this reference will stay the same across all revisions of this entity
            """
            persisting_id: String!
            """
            Permission required
            """
            permission: PlatformActionPermissionRequest!
            """
            List of variable read/write scopes, if applicable to this permission
            """
            variable_read_write_execute_scopes: [VariableReadWriteExecuteScope!]
            """
            List of url parts accessible by this permission, if applicable
            """
            url_parts: [PlatformActionPermissionURLParts!]
            """
            List of host matches, if applicable to this permission
            """
            host_matches: [String!]
            """
            List of event names, if applicable to this permission
            """
            event_names: [String!]
        }

        input VariableReadWriteExecuteScopeInput {
            """
            Variable name
            """
            name: String!
            """
            Can read variable?
            """
            read: Boolean!
            """
            Can modify variable?
            """
            write: Boolean!
            """
            Can execute variable?
            """
            execute: Boolean!
        }

        input PlatformActionPermissionTemplatedCreateInput {
            """
            Permission required
            """
            permission: PlatformActionPermissionRequest!
            """
            List of variable read/write scopes, if applicable to this permission
            """
            variable_read_write_execute_scopes: [VariableReadWriteExecuteScopeInput!]
            """
            List of url parts accessible by this permission, if applicable
            """
            url_parts: [PlatformActionPermissionURLParts!]
            """
            List of host matches, if applicable to this permission
            """
            host_matches: [String!]
            """
            List of event names, if applicable to this permission
            """
            event_names: [String!]
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=PlatformActionPermission
            Method will return a \`PlatformActionPermission\` instance from its ID.
            """
            getPlatformActionPermission(id: ID!): PlatformActionPermission!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getPlatformActionPermission: async (parent: any, args: any, ctx: CTX) => {
            const platformActionPermission = await this.repoFactory(
                PlatformActionPermission,
            ).findByIdThrows(new ObjectID(args.id), userMessages.actionFailed);
            const platformRevision = await this.repoFactory(PlatformRevision).findByIdThrows(
                platformActionPermission.platformRevisionId,
                userMessages.revisionFailed,
            );
            return await this.orgAuth.asUserWithViewAccessOnPlatformRevision(
                ctx,
                platformRevision,
                () => platformActionPermission.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        PlatformActionPermission: {
            variable_read_write_execute_scopes: async (parent: any) => {
                const platformActionPermission = await this.repoFactory(
                    PlatformActionPermission,
                ).findByIdThrows(new ObjectID(parent.id), userMessages.actionFailed);
                return platformActionPermission.variableReadWriteScopes;
            },
            url_parts: async (parent: any) => {
                const platformActionPermission = await this.repoFactory(
                    PlatformActionPermission,
                ).findByIdThrows(new ObjectID(parent.id), userMessages.actionFailed);
                return platformActionPermission.urlParts;
            },
            host_matches: async (parent: any) => {
                const platformActionPermission = await this.repoFactory(
                    PlatformActionPermission,
                ).findByIdThrows(new ObjectID(parent.id), userMessages.actionFailed);
                return platformActionPermission.hostMatches;
            },
            event_names: async (parent: any) => {
                const platformActionPermission = await this.repoFactory(
                    PlatformActionPermission,
                ).findByIdThrows(new ObjectID(parent.id));
                return platformActionPermission.eventNames;
            },
        },
    };
}
