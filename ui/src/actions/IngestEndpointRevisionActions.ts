import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openFullScreenNoRefresh,
    openInfo,
    openLightbox,
    openLightboxNoRefresh,
} from '../utils/PageActionUtils';
import { IngestEndpointDiff } from '../dialogPages/dataManager/IngestEndpointDiff';
import { IngestEndpointRevisionPayloadPreview } from '../dialogPages/dataManager/IngestEndpointRevisionPayloadPreview';
import { IngestEndpointRevisionUpdate } from '../dialogPages/dataManager/IngestEndpointRevisionUpdate';
import { IngestEndpointRevisionDuplicate } from '../dialogPages/dataManager/IngestEndpointRevisionDuplicate';
import { IngestEndpointRevisionFinalise } from '../dialogPages/dataManager/IngestEndpointRevisionFinalise';
import { IngestEndpointRevisionHistory } from '../dialogPages/dataManager/IngestEndpointRevisionHistory';

const ingestEndpointRevisionActions = {
    compareIngestEndpointRevisions: (
        pageActionProps: PageActionProps,
        leftId: string,
        rightId: string,
    ): void => {
        openFullScreenNoRefresh(pageActionProps, IngestEndpointDiff, leftId, rightId);
    },
    previewIngestEndpointRevisionPayload: (pageActionProps: PageActionProps, id: string): void => {
        openLightboxNoRefresh(pageActionProps, IngestEndpointRevisionPayloadPreview, id);
    },
    updateIngestEndpointRevision: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, IngestEndpointRevisionUpdate, id);
    },
    duplicateIngestEndpointRevision: (
        pageActionProps: PageActionProps,
        id: string,
        followUp: (
            id: string,
            pageRefresh: () => void,
            handleDialogClose: (checkChanges: boolean) => void,
        ) => void,
    ): void => {
        openLightbox(
            pageActionProps,
            IngestEndpointRevisionDuplicate,
            id,
            true,
            false,
            undefined,
            followUp,
        );
    },
    finaliseIngestEndpointRevision: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, IngestEndpointRevisionFinalise, id);
    },
    showIngestEndpointRevisionHistory: (
        pageActionProps: PageActionProps,
        id: string,
        name: string,
    ): void => {
        openInfo(pageActionProps, IngestEndpointRevisionHistory, id, name);
    },
};

export { ingestEndpointRevisionActions };
