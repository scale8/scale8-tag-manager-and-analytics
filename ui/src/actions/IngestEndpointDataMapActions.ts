import { PageActionProps } from './PageActions';
import { launchHidden, openDrawer } from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const IngestEndpointDataMapCreate = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointDataMapCreate'),
) as FC<DialogPageProps>;

const IngestEndpointDataMapCreateLastLevel = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointDataMapCreateLastLevel'),
) as FC<DialogPageProps>;

const IngestEndpointDataMapInspect = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointDataMapInspect'),
) as FC<DialogPageProps>;

const IngestEndpointDataMapUpdate = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointDataMapUpdate'),
) as FC<DialogPageProps>;

const IngestEndpointDataMapDelete = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointDataMapDelete'),
) as FC<DialogPageProps>;

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
