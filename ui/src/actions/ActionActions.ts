import { FC } from 'react';
import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openInfo,
    openLightbox,
    openLightboxNoRefresh,
    openLightboxWithName,
    openWideDrawer,
} from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { DialogPageProps } from '../types/DialogTypes';

const ActionGroupDistributionDuplicate = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionGroupDistributionDuplicate'),
) as FC<DialogPageProps>;

const ActionGroupDistributionUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionGroupDistributionUpdate'),
) as FC<DialogPageProps>;

const ActionCreate = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionCreate'),
) as FC<DialogPageProps>;

const ActionDelete = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionDelete'),
) as FC<DialogPageProps>;

const ActionOrderUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionOrderUpdate'),
) as FC<DialogPageProps>;

const ActionInspect = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionInspect'),
) as FC<DialogPageProps>;

const ActionGroupCreate = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionGroupCreate'),
) as FC<DialogPageProps>;

const ActionGroupDuplicate = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionGroupDuplicate'),
) as FC<DialogPageProps>;

const ActionGroupOrderUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionGroupOrderUpdate'),
) as FC<DialogPageProps>;

const ActionGroupDelete = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionGroupDelete'),
) as FC<DialogPageProps>;

const ActionGroupUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionGroupUpdate'),
) as FC<DialogPageProps>;

const ActionGroupDistributionCreate = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionGroupDistributionCreate'),
) as FC<DialogPageProps>;

const ActionGroupDistributionOrderUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionGroupDistributionOrderUpdate'),
) as FC<DialogPageProps>;

const ActionGroupDistributionUnlink = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionGroupDistributionUnlink'),
) as FC<DialogPageProps>;

const ActionGroupDistributionAdd = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionGroupDistributionAdd'),
) as FC<DialogPageProps>;

const ActionUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionUpdate'),
) as FC<DialogPageProps>;

const ActionGroupDistributionHistory = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionGroupDistributionHistory'),
) as FC<DialogPageProps>;

const ActionGroupHistory = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionGroupHistory'),
) as FC<DialogPageProps>;

const ActionHistory = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionHistory'),
) as FC<DialogPageProps>;

const ActionGroupDistributionDelete = dynamic(
    () => import('../dialogPages/tagManager/app/action/ActionGroupDistributionDelete'),
) as FC<DialogPageProps>;

const actionActions = {
    createGlobalAction: (pageActionProps: PageActionProps, revisionId: string): void => {
        openDrawer(pageActionProps, ActionGroupDistributionCreate, revisionId);
    },
    updateGlobalAction: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, ActionGroupDistributionUpdate, id);
    },
    duplicateGlobalAction: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, ActionGroupDistributionDuplicate, id);
    },
    deleteGlobalAction: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, ActionGroupDistributionDelete, id);
    },
    createAction: (
        pageActionProps: PageActionProps,
        actionGroupId: string,
        actionGroupDistributionId: string,
    ): void => {
        openWideDrawer(
            pageActionProps,
            ActionCreate,
            actionGroupId,
            false,
            false,
            actionGroupDistributionId,
        );
    },
    deleteAction: (pageActionProps: PageActionProps, id: string, name: string): void => {
        openLightboxWithName(pageActionProps, ActionDelete, id, name, false, true);
    },
    updateActionOrder: (
        pageActionProps: PageActionProps,
        actionGroupId: string,
        ids: string[],
    ): void => {
        launchHidden(pageActionProps, ActionOrderUpdate, actionGroupId, ids);
    },
    inspectAction: (
        pageActionProps: PageActionProps,
        id: string,
        actionGroupDistributionId: string,
    ): void => {
        openLightboxNoRefresh(pageActionProps, ActionInspect, id, actionGroupDistributionId);
    },
    updateAction: (
        pageActionProps: PageActionProps,
        id: string,
        actionGroupDistributionId: string,
    ): void => {
        openWideDrawer(pageActionProps, ActionUpdate, id, false, false, actionGroupDistributionId);
    },
    showActionHistory: (pageActionProps: PageActionProps, id: string, name: string): void => {
        openInfo(pageActionProps, ActionHistory, id, name);
    },
    createActionGroup: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, ActionGroupCreate, id, false);
    },
    duplicateActionGroup: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, ActionGroupDuplicate, id, false);
    },
    updateActionGroupOrder: (
        pageActionProps: PageActionProps,
        actionGroupDistributionId: string,
        ids: string[],
    ): void => {
        launchHidden(pageActionProps, ActionGroupOrderUpdate, actionGroupDistributionId, ids);
    },
    deleteActionGroup: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, ActionGroupDelete, id, false, true);
    },
    updateActionGroup: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, ActionGroupUpdate, id, false);
    },
    showActionGroupHistory: (pageActionProps: PageActionProps, id: string, name: string): void => {
        openInfo(pageActionProps, ActionGroupHistory, id, name);
    },
    duplicateActionGroupDistribution: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, ActionGroupDistributionDuplicate, id, false);
    },
    updateActionGroupDistributionOrder: (
        pageActionProps: PageActionProps,
        ruleId: string,
        ids: string[],
    ): void => {
        launchHidden(pageActionProps, ActionGroupDistributionOrderUpdate, ruleId, ids);
    },
    deleteActionGroupDistribution: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, ActionGroupDistributionDelete, id, false, true);
    },
    updateActionGroupDistribution: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, ActionGroupDistributionUpdate, id, false);
    },
    addActionGroupDistribution: (
        pageActionProps: PageActionProps,
        id: string,
        tagId: string,
    ): void => {
        openDrawer(pageActionProps, ActionGroupDistributionAdd, id, false, false, tagId, 550);
    },
    unlinkActionGroupDistribution: (
        pageActionProps: PageActionProps,
        id: string,
        ruleId: string,
    ): void => {
        launchHidden(pageActionProps, ActionGroupDistributionUnlink, id, undefined, ruleId);
    },
    showActionGroupDistributionHistory: (
        pageActionProps: PageActionProps,
        id: string,
        name: string,
    ): void => {
        openInfo(pageActionProps, ActionGroupDistributionHistory, id, name);
    },
};

export { actionActions };
