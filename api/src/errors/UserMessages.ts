import { PlatformActionPermissionRequest } from '../enums/PlatformActionPermissionRequest';
import { VarType } from '../enums/VarType';

const userMessages = {
    genericError: 'An Error occurred.',
    genericDataFailure: 'Invalid data encountered processing your information.',
    transactionDataFailure: 'Unable to execute transaction.',
    variableNameInvalid: 'Invalid variable name provided',
    deleteFailed: 'Unable to perform the requested deletion.',
    deleteChildFailed: 'Unable to delete a related entity, please remove it manually if necessary.',
    diffFailed: 'Cannot retrieve data for the comparison.',
    duplicationFailed: 'Cannot perform data duplication.',
    usageFailed: 'Cannot find usage details.',
    ingestEndpointFailed: 'Cannot find ingest endpoint details.',
    platformFailed: 'Cannot find platform details.',
    accountFailed: 'Cannot find account details.',
    emailUpdateFailed: 'Cannot update email address.',
    revisionFailed: 'Cannot find revision details.',
    conditionFailed: 'Cannot find condition/exception details.',
    environmentFailed: 'Cannot find environment details.',
    inviteFailed: 'Cannot find invite details.',
    inviteInvalid: 'The invite is no longer valid.',
    userFailed: 'Cannot find user details.',
    notificationFailed: 'Cannot find notification details.',
    ruleGroupFailed: 'Cannot find rule group details.',
    ruleFailed: 'Cannot find rule details.',
    eventFailed: 'Cannot find event details.',
    actionGroupDistributionFailed: 'Cannot find action group distribution details.',
    actionGroupFailed: 'Cannot find action group details.',
    actionFailed: 'Cannot find action details.',
    triggerFailed: 'Cannot find trigger details.',
    tagFailed: 'Cannot find tag details.',
    appFailed: 'Cannot find application details.',
    envFailed: 'Cannot find environment details.',
    dataMapFailed: 'Cannot find data map details.',
    orgFailed: 'Cannot find organization details.',
    paymentProviderIssue: 'There was a problem with the payment service.',
    billingUnavailable: 'Billing is only available in commercial mode.',
    missingOwner: 'Cannot find owner for the company, please verify your settings.',
    endpointManaged:
        'Ingest endpoint is fully managed, you are therefore unable to make any changes to this entity.',
    endpointNoChildren:
        'Unable to add children to IngestEndpointDataMap as current VarType does not support this.',
    finalisedRevision:
        'Revision has been marked as final so no further changes can be made. Please clone the revision to continue working on it.',
    finalisedRevisionRemoval:
        'Revision has been marked as final so removal is not currently possible as it could be deployed. Revision history would also be lost if this entity is removed.',
    imageTypeInvalid: 'Invalid image type.',
    imageUploadError: 'There was an error handling your image. Please try to upload it again.',
    fileInvalid: 'Invalid file.',
    unmatchedRoleRequirements: `User doesn't meet role requirements.`,
    noViewRightsOnPlatformRevision: 'User does not have view rights on Platform Revision.',
    noCreateRightsOnOrg: 'User does not have create rights on Organization.',
    noCreateRightsOnPlatform: 'User does not have view rights on Platform.',
    noManageRightsOnOrgs: 'User session is not valid, no rights to manage Organizations.',
    noOwnershipRightsOnOrgs: 'User session is not valid, no ownership access on Organization.',
    noAccessOnOrg: 'User session is not valid, no access to Organization.',
    noAdminAccessOnOrg: 'User session is not valid, no admin access on Organization.',
    invalidCredentials: 'Please check your login credentials and try to login again.',
    invalidSession: 'Invalid session. Please check your login credentials and try to login again.',
    invalidTempSession:
        'Invalid session. Please check your login credentials and try to login again.',
    invalidAdminSession:
        'Invalid Admin session. Please check your login credentials and ensure you have Admin rights.',
    permissionNoRWScope: (permission: PlatformActionPermissionRequest) =>
        `${permission} requires at least one variable to be defined with a read / write scope.`,
    permissionMissingUrl: (permission: PlatformActionPermissionRequest) =>
        `${permission} requires at least one url part to be used.`,
    permissionMissingHostMatch: (permission: PlatformActionPermissionRequest) =>
        `${permission} requires at least one host match to be defined.`,
    permissionMissingEventName: (permission: PlatformActionPermissionRequest) =>
        `${permission} requires at least one event name to be defined.`,
    dataMapKeyDuplicate: (key: string) =>
        `Duplicate key '${key}' found, unable to create new data map.`,
    varTypeMismatch: (varType: VarType, value: string) =>
        `Var Type '${varType}' does not match value given => ${value.toString()}.`,

    auditSave: 'Cannot Save Audit Data.',
    auditRemove: 'Cannot Remove Audit Data.',
    auditFailed: 'Cannot find Audit details.',
    auditHistoryOtherOrg: 'History is not from the same organization.',
    auditHistoryFailed: 'Failed to find any audit history',

    userAlreadyIncluded: 'The user is already included in organization.',
    userNotIncluded: 'The user is not included in organization.',
    userAlreadyInvited: 'The user was already invited to join the organization.',

    invalidTwoFactorCode: 'Invalid Code.',
    alreadyEnabledTwoFactor: 'Two factor authentication is enabled',

    maxOrgs: 'Exceeded the maximum number of Organisations a User can create.',
    maxEndpoints: 'Exceeded maximum number of Ingest Endpoints for a Data Manager account.',
    maxApps: 'Exceeded maximum number of Apps for a Tag Manager account.',
    maxConstructor: (constructorName: string) =>
        `Exceeded maximum elements for ${constructorName}s.`,

    validationInvalidSignUp: 'Invalid sign up type',
    validationAppDomain: 'Cannot create app, domain missing.',
    validationOrgName: 'Cannot create org, name missing.',
    validationCAPTCHA: 'CAPTCHA check failed. Please try again.',
    validationName: 'Failed to validate name.',
    validationMissingLastName: 'Please specify a Last Name.',
    validationMissingDomain: 'A domain is required when creating a tag manager account.',
    validationMissingOrgInDMAccount:
        'An organization name is required when creating a data manager account.',
    noCustomValues: 'Platform data container does not support custom values.',
    validationField: (fieldName: string) => `Field '${fieldName}' has failed validation.`,
    duplicateEmail: (email: string) =>
        `An account with email ${email} already exists in our system.`,
    duplicateOrg: (orgName: string) =>
        `An organization named ${orgName} already exists in our system.`,
    duplicateDomain: (domain: string) => `The domain ${domain} is already managed with our system.`,
    unsupportedRegex: 'Unsupported regex type.',
    dataMapArrayExpected: (key: string) => `Expecting ${key} to be an array of an array.`,
    reOrderProblem: 'There was a problem re-ordering items.',
    productNotFound: (id: string) => `Product id ${id} not found.`,
    noSubscription: 'There is currently no subscription, unable make any changes.',
    noProduct: 'There is currently no product attached to account, unable to make any changes.',
    accountNotActive: 'Unable to update any account that is not in "active" state.',
    invalidCertificate: 'Certificate is not not valid with the key or domain provided.',
    noCertificate: 'Expecting a certificate and key to be provided with the custom domain.',
    noCname: 'A CNAME record has not been properly configured for your custom domain.',
    dataMapParseError: 'Failed to parse value for DataMapValue.',
    dataMapSerialiseError: 'Failed to serialise value for DataMapValue.',
    iabListError: 'Failed to load IAB vendor list.',
    noOwnerDelete: 'Cannot delete account, the user is the owner of one or more organizations.',
    noOwner: 'You are not the owner of the organization.',
    noAdminInOwnershipTransfer:
        'You can only transfer the ownership to an administrator of the Organization.',
    noOwnerRemove: 'The owner of the organization cannot be removed.',
    noOwnerPermission: 'You cannot alter the permissions of the organization owner.',
    noFreeTrial: 'Unable to create a free trial for the current user.',
    noFreeDMTrial: 'Unable to create a free Data Manager trial for the current user.',
    noDMAccount: 'Cannot find a Data Manager account for this Organization.',
    duplicateKey: (key: string) => `${key} already exists.`,
    noCustomDomain: 'Ingest endpoint environment is not associated with a custom domain.',
    revisionNotFinalAttaching: 'Revision is not in final state, unable to attach it.',
    unexpectedIssue: 'An unexpected issue has occurred, please contact support.',
    awsNoBucket: (bucket: string) =>
        `Unable to find the bucket "${bucket}" using the credentials provided.`,
    awsBucketCantWrite: (bucket: string) =>
        `Unable to write to bucket '${bucket}' using the credentials provided.`,
    awsKinesisCantWrite: (streamName: string) =>
        `Unable to write to stream '${streamName}' using the credentials provided.`,
    invalidServiceAccount: 'Expecting service account JSON to be an object.',
    noStorageProvider:
        'A storage provider configuration is required when creating a tracking environment.',
    datasetFailure: (dataset: string) =>
        `Failed when trying to create the new data set '${dataset}' as it does not currently exist.`,
    datasetVerificationFailure: (dataset: string) =>
        `Unable to verify data set '${dataset}' exists. Please check the service account details provided have the correct permissions.`,
    mongoConnectionStringVerificationFailure: (connectionString: string) =>
        `Unable to connect with: '${connectionString}'.`,
    mongoDatabaseVerificationFailure: (databaseName: string) =>
        `Unable to access to: '${databaseName}'. Please check that the user specified have the correct permissions.`,
    incompatibleRevisions: 'Incompatible revisions.',
    cannotFindAccount: (accountType: string) =>
        `Cannot find a ${accountType} account for this Org.`,
    ruleNoTrigger: 'Rule does not have a trigger attached to it.',
    conversionError: 'Error during data conversion.',
    gadStillAttached: (ruleId: string) =>
        `Global action group distribution is still attached to rule ${ruleId}, therefore unable to delete it until entity is unlinked.`,
    invalidPlatformAction: 'Invalid platform action provided.',
    cantValidatePlatformAction:
        'Failed to validate platform action properties against the associated platform data map schema.',
    cantFindPlatform: 'Unable to find installed platform.',
    platformNotPublished: 'Platform revision has not yet been published, unable to link it.',
    cantLinkCore: 'Unable to unlink core platform.',
    revisionLockedLinkingPlatformRevision:
        'Revision is locked, unable to link new platform revision.',
    forceRemoveEntity: (model: string) => `Unsupported entity ${model} to be removed.`,
    conditionMatchNotAllowed: 'Custom match is not allowed here.',
    conditionMatchInvalid: 'Match provided is invalid.',
    conditionDCInvalid: 'Invalid platform data container provided.',
    conditionMissingMatchProperties:
        "Unable to create condition rule from input, either 'match' or 'match_id' must be provided.",
    dmSchemaDefinitionIssue:
        'Failed to define any of -> [value, values, children or repeated_children].',
    envNoCustomDomain: 'Environment is not associated with a custom domain.',
    envKeyInvalid: 'Environment key must only contain letters A-Z and _.',
    platformEventInvalid: 'Invalid platform event provided.',
    eventCreateInvalidDM: 'Failed to validate data maps on event creation.',
    eventCreateInvalidInput:
        "Unable to create event from input, either 'browser_event' or 'platform_event_id' must be provided.",
    eventUpdateInvalidDM: 'Failed to validate data maps on event update.',
    platformDeleteInvalid: 'Only templated platform actions can be deleted via this method.',
    platformUpdateInvalid: 'Only templated platform actions can be updated via this method.',
    platformPublishNoRevision:
        'In order to publish a platform, at least one revision should have been published first',
    featureInBeta:
        'This feature is currently in beta. Please contact us to enable this feature on your account.',
    duplicateCustomPlatformRevision:
        'Unable to duplicate a custom platform revision. Please see docs.',
    ruleGABNotSameRevision:
        'Rule and global action group distribution are not part of the same revision.',
    triggerDeletingUsed: (ruleId: string) =>
        `Unable to delete trigger, it in use by rule ${ruleId}.`,
    triggerDeletingRule: 'Unable to delete trigger, a rule must linked to a trigger.',
    triggerDuplicateRule:
        'Trigger is attached to a rule and therefore unable to duplicate it at this level.',
    emailServerNotEnabled: 'Email server not enabled.',
    cannotInvite: 'Signup disabled, cannot invite users.',
    signupDisabled: 'Signup disabled.',
    twoFactorAuthDisabled: '2-Factor Authentication disabled.',
    gitHubSsoDisabled: 'GitHub Signup Disabled.',
};

export default userMessages;
