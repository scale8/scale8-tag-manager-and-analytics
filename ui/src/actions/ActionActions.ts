import { PageActionProps } from './PageActions';
import { ActionGroupDistributionDuplicate } from '../dialogPages/tagManager/app/action/ActionGroupDistributionDuplicate';
import { ActionGroupDistributionUpdate } from '../dialogPages/tagManager/app/action/ActionGroupDistributionUpdate';
import { ActionCreate } from '../dialogPages/tagManager/app/action/ActionCreate';
import { ActionDelete } from '../dialogPages/tagManager/app/action/ActionDelete';
import { ActionOrderUpdate } from '../dialogPages/tagManager/app/action/ActionOrderUpdate';
import { ActionInspect } from '../dialogPages/tagManager/app/action/ActionInspect';
import { ActionGroupCreate } from '../dialogPages/tagManager/app/action/ActionGroupCreate';
import { ActionGroupDuplicate } from '../dialogPages/tagManager/app/action/ActionGroupDuplicate';
import { ActionGroupOrderUpdate } from '../dialogPages/tagManager/app/action/ActionGroupOrderUpdate';
import { ActionGroupDelete } from '../dialogPages/tagManager/app/action/ActionGroupDelete';
import { ActionGroupUpdate } from '../dialogPages/tagManager/app/action/ActionGroupUpdate';
import { ActionGroupDistributionCreate } from '../dialogPages/tagManager/app/action/ActionGroupDistributionCreate';
import { ActionGroupDistributionOrderUpdate } from '../dialogPages/tagManager/app/action/ActionGroupDistributionOrderUpdate';
import { ActionGroupDistributionUnlink } from '../dialogPages/tagManager/app/action/ActionGroupDistributionUnlink';
import { ActionGroupDistributionAdd } from '../dialogPages/tagManager/app/action/ActionGroupDistributionAdd';
import { ActionUpdate } from '../dialogPages/tagManager/app/action/ActionUpdate';
import { ActionGroupDistributionHistory } from '../dialogPages/tagManager/app/action/ActionGroupDistributionHistory';
import { ActionGroupHistory } from '../dialogPages/tagManager/app/action/ActionGroupHistory';
import { ActionHistory } from '../dialogPages/tagManager/app/action/ActionHistory';
import { ActionGroupDistributionDelete } from '../dialogPages/tagManager/app/action/ActionGroupDistributionDelete';
import {
    launchHidden,
    openDrawer,
    openInfo,
    openLightbox,
    openLightboxNoRefresh,
    openLightboxWithName,
    openWideDrawer,
} from '../utils/PageActionUtils';

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
