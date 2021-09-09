import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openDrawerContextOnly,
    openInfo,
    openLightboxNoRefresh,
} from '../utils/PageActionUtils';
import { IngestEndpointEnvironmentsInstallInstructions } from '../dialogPages/dataManager/IngestEndpointEnvironmentsInstallInstructions';
import { IngestEndpointEnvironmentDelete } from '../dialogPages/dataManager/IngestEndpointEnvironmentDelete';
import { IngestEndpointEnvironmentHistory } from '../dialogPages/dataManager/IngestEndpointEnvironmentHistory';
import { IngestEndpointEnvironmentCreate } from '../dialogPages/dataManager/IngestEndpointEnvironmentCreate';
import { IngestEndpointEnvironmentUpdate } from '../dialogPages/dataManager/IngestEndpointEnvironmentUpdate';

const ingestEndpointEnvironmentActions = {
    createIngestEndpointEnvironment: (
        pageActionProps: PageActionProps,
        ingestEndpointId: string,
    ): void => {
        openDrawerContextOnly(pageActionProps, IngestEndpointEnvironmentCreate, ingestEndpointId);
    },
    updateIngestEndpointEnvironment: (
        pageActionProps: PageActionProps,
        id: string,
        ingestEndpointId: string,
    ): void => {
        openDrawer(
            pageActionProps,
            IngestEndpointEnvironmentUpdate,
            id,
            true,
            false,
            ingestEndpointId,
        );
    },
    installIngestEndpointEnvironment: (pageActionProps: PageActionProps, id: string): void => {
        openLightboxNoRefresh(pageActionProps, IngestEndpointEnvironmentsInstallInstructions, id);
    },
    deleteIngestEndpointEnvironment: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, IngestEndpointEnvironmentDelete, id);
    },
    showIngestEndpointEnvironmentHistory: (
        pageActionProps: PageActionProps,
        id: string,
        name: string,
    ): void => {
        openInfo(pageActionProps, IngestEndpointEnvironmentHistory, id, name);
    },
};

export { ingestEndpointEnvironmentActions };
