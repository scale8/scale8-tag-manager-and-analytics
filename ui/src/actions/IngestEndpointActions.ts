import { PageActionProps } from './PageActions';
import { launchHidden, openDrawer, openDrawerContextOnly } from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const IngestEndpointCreate = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointCreate'),
) as FC<DialogPageProps>;

const IngestEndpointUpdate = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointUpdate'),
) as FC<DialogPageProps>;

const IngestEndpointDelete = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointDelete'),
) as FC<DialogPageProps>;

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
