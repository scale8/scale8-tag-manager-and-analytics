import { PageActionProps } from './PageActions';
import { launchHidden, openDrawer } from '../utils/PageActionUtils';
import {
    IngestEndpointDataMapCreate,
    IngestEndpointDataMapCreateLastLevel,
} from '../dialogPages/dataManager/IngestEndpointDataMapCreate';
import {
    IngestEndpointDataMapInspect,
    IngestEndpointDataMapUpdate,
} from '../dialogPages/dataManager/IngestEndpointDataMapUpdate';
import { IngestEndpointDataMapDelete } from '../dialogPages/dataManager/IngestEndpointDataMapDelete';

const ingestEndpointDataMapActions = {
    createDataIngestEndpointMap: (
        pageActionProps: PageActionProps,
        level: number,
        ingestEndpointRevisionId: string,
        dataMapParentId?: string,
        dataMapParentName?: string,
    ): void => {
        openDrawer(
            pageActionProps,
            level === 3 ? IngestEndpointDataMapCreateLastLevel : IngestEndpointDataMapCreate,
            dataMapParentId,
            true,
            false,
            ingestEndpointRevisionId,
            undefined,
            undefined,
            dataMapParentName,
        );
    },
    updateDataIngestEndpointMap: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, IngestEndpointDataMapUpdate, id);
    },
    inspectDataIngestEndpointMap: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, IngestEndpointDataMapInspect, id);
    },
    deleteDataIngestEndpointMap: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, IngestEndpointDataMapDelete, id);
    },
};

export { ingestEndpointDataMapActions };
