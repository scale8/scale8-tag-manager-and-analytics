import { PageActionProps } from './PageActions';
import { launchHidden, openWideDrawer, openWideDrawerContextOnly } from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const TemplatedActionCreate = dynamic(
    () => import('../dialogPages/tagManager/platform/TemplatedActionCreate'),
) as FC<DialogPageProps>;

const TemplatedActionUpdate = dynamic(
    () => import('../dialogPages/tagManager/platform/TemplatedActionUpdate'),
) as FC<DialogPageProps>;

const TemplatedActionDelete = dynamic(
    () => import('../dialogPages/tagManager/platform/TemplatedActionDelete'),
) as FC<DialogPageProps>;

const templatedActionActions = {
    createTemplatedAction: (pageActionProps: PageActionProps, revisionId: string): void => {
        openWideDrawerContextOnly(pageActionProps, TemplatedActionCreate, revisionId);
    },
    updateTemplatedAction: (pageActionProps: PageActionProps, id: string): void => {
        openWideDrawer(pageActionProps, TemplatedActionUpdate, id);
    },
    inspectTemplatedAction: (pageActionProps: PageActionProps, id: string): void => {
        openWideDrawer(
            pageActionProps,
            TemplatedActionUpdate,
            id,
            true,
            false,
            undefined,
            undefined,
            undefined,
            true,
        );
    },
    deleteTemplatedAction: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, TemplatedActionDelete, id);
    },
};

export { templatedActionActions };
