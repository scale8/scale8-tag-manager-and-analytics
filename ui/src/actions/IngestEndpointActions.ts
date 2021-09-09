import { PageActionProps } from './PageActions';
import { launchHidden, openDrawer, openDrawerContextOnly } from '../utils/PageActionUtils';
import { IngestEndpointCreate } from '../dialogPages/dataManager/IngestEndpointCreate';
import { IngestEndpointUpdate } from '../dialogPages/dataManager/IngestEndpointUpdate';
import { IngestEndpointDelete } from '../dialogPages/dataManager/IngestEndpointDelete';

const ingestEndpointActions = {
    createIngestEndpoint: (pageActionProps: PageActionProps, dataManagerId: string): void => {
        openDrawerContextOnly(pageActionProps, IngestEndpointCreate, dataManagerId);
    },
    updateIngestEndpoint: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, IngestEndpointUpdate, id);
    },
    deleteIngestEndpoint: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, IngestEndpointDelete, id);
    },
};

export { ingestEndpointActions };
