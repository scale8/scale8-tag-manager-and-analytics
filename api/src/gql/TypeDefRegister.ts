// noinspection GraphQLEmptyType

import { inject, injectable } from 'inversify';
import TYPES from '../container/IOC.types';
import { gql } from 'apollo-server-express';
import DateTime from './scalars/DateTime';
import JSON from './scalars/JSON';
import { DocumentNode } from 'graphql';
import Manager from '../abstractions/Manager';
import { print } from 'graphql/language/printer';
import Model from '../mongo/abstractions/Model';
import GQLManagersFactory from '../container/factoryTypes/GQLManagersFactory';
import DataMapValue from './scalars/DataMapValue';
import { ISO } from '../core/ISO';
import TimeZones from '../core/TimeZones';
import OperationOwner from '../enums/OperationOwner';
import AuditAction from '../enums/AuditAction';
import GQLMethod from '../enums/GQLMethod';
import SignUpType from '../enums/SignUpType';
import { AccountProduct } from '../enums/AccountProduct';
import { ValidationType } from '../../../common/enums/ValidationType';
import { PlatformType } from '../enums/PlatformType';
import { PlatformActionPermissionRequest } from '../enums/PlatformActionPermissionRequest';
import { PlatformActionPermissionURLParts } from '../enums/PlatformActionPermissionURLParts';
import { RevisionEntityParentType } from '../enums/RevisionEntityParentType';
import { VarType } from '../enums/VarType';
import { ActionGroupDistributionType } from '../enums/ActionGroupDistributionType';
import { StorageProvider } from '../enums/StorageProvider';
import { AwsRegion } from '../enums/AwsRegion';
import { ConditionType } from '../enums/ConditionType';
import { NotificationType } from '../enums/NotificationType';
import {
    DataManagerDateTimeMacros,
    DataManagerIntegerMacros,
    DataManagerStringMacros,
    DataManagerTimestampMacros,
} from '../enums/DataManagerMacros';
import { Mode } from '../enums/Mode';
import { InputType } from '../../../common/enums/InputType';
import { TypeIcon } from '../../../common/enums/TypeIcon';

@injectable()
export default class TypeDefRegister {
    protected managers: Manager<Model>[] = [];

    public constructor(@inject(TYPES.GQLManagersFactory) managersFactory: GQLManagersFactory) {
        this.managers = managersFactory();
    }

    private static enumToGQL(enumType: Record<string, unknown>): string {
        const keys = Object.keys(enumType)
            .map((_) => {
                const name = _.toUpperCase()
                    .replace(/_/g, ' ')
                    .replace(/([a-z])([a-z]+)/gi, (s, a, b) => {
                        return `${a}${b.toLowerCase()}`;
                    });
                return `"""*${name}*""" ${_}`;
            })
            .join('\n');
        return `{\n${keys}\n}`;
    }

    protected coreTypeDefs(): DocumentNode {
        return gql`
            """
            @type
            """
            type GroupingCount {
                key: String!
                count: Int!
            }

            """
            @type
            """
            type GroupingCountsResponse {
                from: DateTime!
                to: DateTime!
                result: [GroupingCount!]!
            }

            """
            @type
            """
            type IntResponse {
                from: DateTime!
                to: DateTime!
                result: Int!
            }

            """
            @type
            """
            type FloatResponse {
                from: DateTime!
                to: DateTime!
                result: Float!
            }

            enum TimeSlice {
                YEAR
                MONTH
                DAY
                HOUR
                MINUTE
            }

            """
            @type
            Used as a container object
            """
            type EmptyArrayBox {
                """
                Represents an empty array
                """
                ea: Boolean
            }
            """
            @type
            Used as a container object
            """
            type StringArrayBox {
                """
                Represents a list of strings
                """
                sa: [String!]!
            }
            """
            @type
            Used as a container object
            """
            type IntArrayBox {
                """
                Represents a list of integers
                """
                ia: [Int!]!
            }
            """
            @type
            Used as a container object
            """
            type FloatArrayBox {
                """
                Represents a list of floats
                """
                fa: [Float!]!
            }
            """
            @type
            Used as a container object
            """
            type BooleanArrayBox {
                """
                Represents a list of booleans
                """
                ba: [Boolean!]!
            }
            """
            @type
            Used as a container object
            """
            type DateArrayBox {
                """
                Represents a list of dates
                """
                da: [DateTime!]!
            }
            """
            @type
            Used as a container object
            """
            type StringBox {
                """
                Represents a single string value
                """
                s: String!
            }
            """
            @type
            Used as a container object
            """
            type IntBox {
                """
                Represents a single integer value
                """
                i: Int!
            }
            """
            @type
            Used as a container object
            """
            type FloatBox {
                """
                Represents a single float value
                """
                f: Float!
            }
            """
            @type
            Used as a container object
            """
            type BooleanBox {
                """
                Represents a single boolean value
                """
                b: Boolean!
            }
            """
            @type
            Used as a container object
            """
            type DateBox {
                """
                Represents a single date value
                """
                d: DateTime!
            }

            """
            @type
            """
            type BigQueryDateTime {
                value: String!
            }

            """
            @type
            """
            type EnvironmentVariable {
                key: String!
                value: String!
            }

            """
            A set of supported \`Notification\` types.
            """
            enum NotificationType
            ${TypeDefRegister.enumToGQL(NotificationType)}

            """
            Application mode.
            """
            enum Mode
            ${TypeDefRegister.enumToGQL(Mode)}

            """
            A set of supported \`Data Manager Macros\` for \`String\` values.
            """
            enum DataManagerStringMacros
            ${TypeDefRegister.enumToGQL(DataManagerStringMacros)}

            """
            A set of supported \`Data Manager Macros\` for \`Integer\` values.
            """
            enum DataManagerIntegerMacros
            ${TypeDefRegister.enumToGQL(DataManagerIntegerMacros)}

            """
            A set of supported \`Data Manager Macros\` for \`DateTime\` values.
            """
            enum DataManagerDateTimeMacros
            ${TypeDefRegister.enumToGQL(DataManagerDateTimeMacros)}

            """
            A set of supported \`Data Manager Macros\` for \`Timestamp\` values.
            """
            enum DataManagerTimestampMacros
            ${TypeDefRegister.enumToGQL(DataManagerTimestampMacros)}

            """
            A set of supported \`AccountProduct\`s
            """
            enum AccountProduct
            ${TypeDefRegister.enumToGQL(AccountProduct)}

            """
            A set of supported \`ValidationType\`s used by \`PlatformDataMap\` entities
            """
            enum ValidationType
            ${TypeDefRegister.enumToGQL(ValidationType)}

            """
            A set of supported \`TypeIcon\`s used by \`Platform\` entities
            """
            enum TypeIcon
            ${TypeDefRegister.enumToGQL(TypeIcon)}

            """
            A set of supported \`PlatformTypes\`s used by \`Platform\`
            """
            enum PlatformType
            ${TypeDefRegister.enumToGQL(PlatformType)}

            """
            A set of supported \`PlatformActionPermissionRequest\`s used by \`PlatformActionPermission\`
            """
            enum PlatformActionPermissionRequest
            ${TypeDefRegister.enumToGQL(PlatformActionPermissionRequest)}

            """
            A set of supported \`PlatformActionPermissionURLParts\`s used by \`PlatformActionPermission\`
            """
            enum PlatformActionPermissionURLParts
            ${TypeDefRegister.enumToGQL(PlatformActionPermissionURLParts)}

            """
            A set of supported \`OperationOwner\`s used by \`Audit\`
            """
            enum OperationOwner
            ${TypeDefRegister.enumToGQL(OperationOwner)}

            """
            A set of supported \`AuditAction\`s used by \`Audit\`
            """
            enum AuditAction
            ${TypeDefRegister.enumToGQL(AuditAction)}

            """
            A set of supported \`GQLMethod\`s used by \`Audit\`
            """
            enum GQLMethod
            ${TypeDefRegister.enumToGQL(GQLMethod)}

            """
            A set of supported \`RevisionEntityParentType\`s for use with \`ActionGroupDistribution\`s and \`Trigger\`s
            """
            enum RevisionEntityParentType
            ${TypeDefRegister.enumToGQL(RevisionEntityParentType)}

            """
            A set of supported \`VarType\`s for use with \`DataMap\`s and \`PlatformDataMap\`s
            """
            enum VarType
            ${TypeDefRegister.enumToGQL(VarType)}

            """
            A set of supported \`InputType\`s for use with \`PlatformDataMap\`s
            """
            enum InputType
            ${TypeDefRegister.enumToGQL(InputType)}

            """
            A set of supported \`ActionGroupDistributionType\`s for use with \`ActionGroupDistribution\`s
            """
            enum ActionGroupDistributionType
            ${TypeDefRegister.enumToGQL(ActionGroupDistributionType)}

            """
            A set of supported country codes
            """
            enum CountryCode
            ${ISO.countryCodesAsGQL()}

            """
            A set of supported timezones
            """
            enum TimeZone
            ${TimeZones.timeZonesAsGQL()}

            """
            A set of supported storage providers for use with \`TrackedEnvironment\`s
            """
            enum StorageProvider
            ${TypeDefRegister.enumToGQL(StorageProvider)}

            """
            A set of supported AWS regions for use with \`TrackedEnvironment\`s
            """
            enum AWSRegion
            ${TypeDefRegister.enumToGQL(AwsRegion)}

            """
            To be used with \`ConditionRule\`, these are the valid condition types currently supported.
            """
            enum ConditionType
            ${TypeDefRegister.enumToGQL(ConditionType)}

            """
            To be used with \`SignUpRequest\`, these are the valid signup types currently supported.
            """
            enum SignUpType
            ${TypeDefRegister.enumToGQL(SignUpType)}

            """
            @union
            """
            union GQLScalarBox =
                  StringArrayBox
                | IntArrayBox
                | FloatArrayBox
                | BooleanArrayBox
                | DateArrayBox
                | EmptyArrayBox
                | StringBox
                | IntBox
                | FloatBox
                | BooleanBox
                | DateBox

            """
            @type
            When a model in the system is deleted, we return this acknowledgement structure to better inform of what has been deleted.
            """
            type ModelDeleteAcknowledgement {
                """
                Name of the model that the entity belonged to
                """
                model: String!
                """
                The ID of the model that has been deleted
                """
                id: ID!
                """
                The name of the model that has been deleted
                """
                name: String!
            }

            """
            @type
            """
            type RevisionDiffProp {
                """
                The name of the field belonging to the model
                """
                field: String!
                """
                The name of the field belonging to the model as described in GraphQL
                """
                gqlField: String!
                """
                The value associated with the left model's field
                """
                left: GQLScalarBox
                """
                The value associated with the right model's field
                """
                right: GQLScalarBox
                """
                The state of the fields when compared with each other
                """
                state: String!
                """
                If the field is a reference to another model
                """
                ref: Boolean!
            }

            """
            @type
            """
            type RevisionDiff {
                """
                Name of the model
                """
                model: String!
                """
                The ID that symbolically links the two models. One will have been cloned from the other if both exist
                """
                id: String!
                """
                The model held on the left
                """
                left: String
                """
                The model held on the right
                """
                right: String
                """
                The overall state of the model
                """
                state: String
                """
                The properties of the model
                """
                props: [RevisionDiffProp!]!
            }

            """
            @type
            """
            type DefaultValueContainerArray {
                values: [DataMapValue!]
            }
            """
            @type
            """
            type DefaultValueContainer {
                value: DataMapValue
            }

            """
            In order to use AWS as your storage engine, you will need to create an AWS account and create a new service account for Scale8. Please see our documentation on how to configure this.
            """
            input AWSStorageConfig {
                """
                Your AWS access key. We recommend following our tutorial and creating Scale8 credentials to be used with the region / bucket selected only. We only require the ability to list and add files. We never require the ability to read your data.
                """
                access_key_id: String!
                """
                Your AWS secret key.
                """
                secret_access_key: String!
                """
                The AWS region in which you want the data to be placed and your bucket has been created.
                """
                region: AWSRegion!
                """
                An optional path prefix. By default the path prefix is '/'
                """
                path_prefix: String = "/"
                """
                The name of the storage bucket currently in use
                """
                bucket_name: String!
            }

            """
            BigQuery stream configuration required a Google Cloud Services account to be setup and configured. PLease follow our guide and configure this properly before attempting to use this service.
            """
            input GCBigQueryStreamConfig {
                """
                Service Account JSON for Google Cloud's BigQuery administrative role.
                """
                service_account_json: JSON!
                """
                The 'Data Set' under which a new table will be created.
                """
                data_set_name: String!
                """
                The location of the data set, if it doesn't exist, we'll try and create it using the location specified
                """
                data_set_location: String = "US"
                """
                If this is set to true, a WHERE clause will be required when querying data in order to reduce costs. See BigQuery documentation for more details.
                """
                require_partition_filter_in_queries: Boolean = true
            }

            """
            In order to use MongoDB as your storage engine, you just need to provide connection string and database name.
            """
            input MongoDbPushConfig {
                """
                Use the api MongoDB server as storage provider
                """
                use_api_mongo_server: Boolean!
                """
                Your MongoDB server connection string.
                """
                connection_string: String
                """
                The name of the database that will store your data
                """
                database_name: String
            }

            """
            @union
            """
            union DefaultValue = DefaultValueContainer | DefaultValueContainerArray

            """
            @model
            """
            type UserPermissions {
                """
                User is able to view / list.
                """
                can_view: Boolean!
                """
                User can create new entities
                """
                can_create: Boolean!
                """
                User can edit existing entities
                """
                can_edit: Boolean!
                """
                User can delete existing entities
                """
                can_delete: Boolean!
                """
                User can manage every entity from the parent down.
                """
                is_admin: Boolean!
            }
            input Filter {
                prop_name: String!
                regex: String!
            }

            """
            @model
            """
            type StringMap {
                """
                Property key
                """
                k: String!
                """
                Property value
                """
                v: String!
            }

            """
            @model
            """
            type ConsentPurpose {
                """
                Consent Purpose ID
                """
                id: Int!
                """
                Consent Purpose Name
                """
                name: String!
            }

            """
            @model
            """
            type ConsentVendor {
                """
                Consent Vendor ID
                """
                id: Int!
                """
                Consent Vendor Name
                """
                name: String!
            }

            """
            @model
            """
            type TagManagerProduct {
                id: String!
                name: String!
                amount: Int!
                page_views: Int!
            }

            """
            @model
            """
            type DataManagerProduct {
                id: String!
                name: String!
                amount: Int!
                requests: Int!
                gbs: Float!
            }

            """
            @model
            """
            type CoreElementDataMapDescription {
                name: String!
                description: String!
                var_type: String!
                default_value: String!
                is_required: String!
            }

            """
            @model
            """
            type CoreElementDescription {
                name: String!
                description: String!
                inputs: [CoreElementDataMapDescription]!
            }

            """
            @model
            """
            type Config {
                """
                If the platform has been setup and configured yet
                """
                is_configured: Boolean
                """
                A list of Tag Manager Products
                """
                tag_manager_products: [TagManagerProduct!]!
                """
                A list of Data Manager Products
                """
                data_manager_products: [DataManagerProduct!]!
                """
                A list of supported countries
                """
                countries: [StringMap!]!
                """
                A list of supported time zones
                """
                time_zones: [StringMap!]!
                """
                A list of supported \`App\` types
                """
                app_types: [StringMap!]!
                """
                A list of supported condition types, for use with \`ConditionRule\`
                """
                condition_types: [StringMap!]!
                """
                A list of supported input types, for use with \`PlatformDataMap\`
                """
                input_types: [StringMap!]!
                """
                A list of supported \`Tag\` types
                """
                tag_types: [StringMap!]!
                """
                A list of supported \`ActionGroupDistribution\` types
                """
                action_group_distribution_types: [StringMap!]!
                """
                A list of consent purposes
                """
                consent_purposes: [ConsentPurpose!]!
                """
                A list of consent vendors
                """
                consent_vendors: [ConsentVendor!]!
                """
                A list of core events
                """
                core_events: [CoreElementDescription]!
                """
                A list of core data containers
                """
                core_data_containers: [CoreElementDescription]!
                """
                A list of core actions
                """
                core_actions: [CoreElementDescription]!
                """
                The application mode currently in use
                """
                mode: Mode!
                """
                Whether the application will allow signup
                """
                use_signup: Boolean
                """
                Whether the application will allow two-factor authentication
                """
                use_two_factor_auth: Boolean
                """
                Whether the application will allow github single sign on
                """
                use_github_sso: Boolean
                """
                Whether the application will allow sending emails
                """
                use_email: Boolean
                """
                Whether the application will record an audit trail
                """
                is_audit_enabled: Boolean
                """
                The backend started in developer mode
                """
                is_dev: Boolean
            }

            """
            @model
            Used to share extra enumeration types with frontends
            """
            type ExtraTypes {
                notification_type: NotificationType
                dm_macros_string: DataManagerStringMacros
                dm_macros_integer: DataManagerIntegerMacros
                dm_macros_date: DataManagerDateTimeMacros
                dm_macros_ts: DataManagerTimestampMacros
            }

            type Query {
                """
                S8 Version
                """
                v: String
                """
                The S8 \`Config\`. Contains all the common mappings for countries, time zones, condition types etc.
                """
                config: Config!
                """
                Type exposure to share enumeration types with frontends
                """
                extra_types: ExtraTypes
            }
            type Mutation {
                """
                S8 Version
                """
                v: String
            }
        `;
    }

    protected scalarTypeDefs(): DocumentNode[] {
        return [DateTime.type, JSON.type, DataMapValue.type];
    }

    protected managerTypeDefs(): DocumentNode[] {
        return this.managers
            .map((model) => model.getGQLSchema())
            .filter(((schema) => schema !== null) as (x: DocumentNode | null) => x is DocumentNode);
    }

    public getTypeDefs(): DocumentNode[] {
        return [this.coreTypeDefs(), ...this.scalarTypeDefs(), ...this.managerTypeDefs()];
    }

    // noinspection JSUnusedGlobalSymbols
    public getTypeDefsAsStrings(): string[] {
        return this.getTypeDefs().map((typeDef) => print(typeDef));
    }
}
