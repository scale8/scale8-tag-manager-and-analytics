import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openDrawerContextOnly,
    openInfo,
    openLightboxNoRefresh,
} from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const IngestEndpointEnvironmentsInstallInstructions = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointEnvironmentsInstallInstructions'),
) as FC<DialogPageProps>;

const IngestEndpointEnvironmentDelete = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointEnvironmentDelete'),
) as FC<DialogPageProps>;

const IngestEndpointEnvironmentHistory = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointEnvironmentHistory'),
) as FC<DialogPageProps>;

const IngestEndpointEnvironmentCreate = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointEnvironmentCreate'),
) as FC<DialogPageProps>;

const IngestEndpointEnvironmentUpdate = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointEnvironmentUpdate'),
) as FC<DialogPageProps>;

const IngestEndpointEnvironmentEditCustomDomain = dynamic(
    () => import('../dialogPages/dataManager/IngestEndpointEnvironmentEditCustomDomain'),
) as FC<DialogPageProps>;

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
    editCustomDomainIngestEndpointEnvironment: (
        pageActionProps: PageActionProps,
        id: string,
    ): void => {
        openDrawer(pageActionProps, IngestEndpointEnvironmentEditCustomDomain, id);
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
