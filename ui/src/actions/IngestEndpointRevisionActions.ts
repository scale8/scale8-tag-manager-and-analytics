import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openFullScreenNoRefresh,
    openInfo,
    openLightbox,
    openLightboxNoRefresh,
} from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const IngestEndpointDiff = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointDiff'),
) as FC<DialogPageProps>;

const IngestEndpointRevisionPayloadPreview = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointRevisionPayloadPreview'),
) as FC<DialogPageProps>;

const IngestEndpointRevisionUpdate = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointRevisionUpdate'),
) as FC<DialogPageProps>;

const IngestEndpointRevisionDuplicate = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointRevisionDuplicate'),
) as FC<DialogPageProps>;

const IngestEndpointRevisionFinalise = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointRevisionFinalise'),
) as FC<DialogPageProps>;

const IngestEndpointRevisionHistory = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointRevisionHistory'),
) as FC<DialogPageProps>;

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
