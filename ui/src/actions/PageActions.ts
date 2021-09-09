import { Dispatch } from 'react';
import { organizationActions } from './OrganizationActions';
import { organizationUserActions } from './OrganizationUserActions';
import { ingestEndpointActions } from './IngestEndpointActions';
import { ingestEndpointRevisionActions } from './IngestEndpointRevisionActions';
import { ingestEndpointDataMapActions } from './IngestEndpointDataMapActions';
import { ingestEndpointEnvironmentActions } from './IngestEndpointEnvironmentActions';
import { platformActions } from './PlatformActions';
import { platformRevisionActions } from './PlatformRevisionActions';
import { applicationActions } from './ApplicationActions';
import { appPlatformActions } from './AppPlatformActions';
import { appEnvironmentActions } from './AppEnvironmentActions';
import { appRevisionActions } from './AppRevisionActions';
import { appPlatformRevisionActions } from './AppPlatformRevisionActions';
import { tagActions } from './TagActions';
import { adminActions } from './AdminActions';
import { ruleActions } from './RulesActions';
import { triggerActions } from './TriggerActions';
import { actionActions } from './ActionActions';
import { globalActions } from './GlobalActions';
import { templatedActionActions } from './TemplatedActionActions';
import { DialogAction } from '../context/DialogReducer';

export type TableRefresh = (mustResetTable: boolean, mustResetCache: boolean) => void;

export type PageActionProps = {
    dispatchDialogAction: Dispatch<DialogAction>;
    refresh?: TableRefresh;
};

const pageActions = {
    ...organizationActions,
    ...organizationUserActions,
    ...ingestEndpointActions,
    ...ingestEndpointRevisionActions,
    ...ingestEndpointEnvironmentActions,
    ...ingestEndpointDataMapActions,
    ...platformActions,
    ...platformRevisionActions,
    ...applicationActions,
    ...appPlatformActions,
    ...appEnvironmentActions,
    ...appRevisionActions,
    ...appPlatformRevisionActions,
    ...tagActions,
    ...adminActions,
    ...ruleActions,
    ...triggerActions,
    ...actionActions,
    ...globalActions,
    ...templatedActionActions,
};

export { pageActions };
