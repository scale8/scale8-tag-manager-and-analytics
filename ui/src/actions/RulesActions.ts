import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openDrawerContextOnly,
    openInfo,
    openLightbox,
} from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const RuleCreate = dynamic(
    () => import('../dialogPages/tagManager/app/tag/RuleCreate'),
) as FC<DialogPageProps>;

const RuleDuplicate = dynamic(
    () => import('../dialogPages/tagManager/app/tag/RuleDuplicate'),
) as FC<DialogPageProps>;

const RuleOrderUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/tag/RuleOrderUpdate'),
) as FC<DialogPageProps>;

const RuleDelete = dynamic(
    () => import('../dialogPages/tagManager/app/tag/RuleDelete'),
) as FC<DialogPageProps>;

const RuleUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/tag/RuleUpdate'),
) as FC<DialogPageProps>;

const RuleHistory = dynamic(
    () => import('../dialogPages/tagManager/app/tag/RuleHistory'),
) as FC<DialogPageProps>;

const RuleGroupCreate = dynamic(
    () => import('../dialogPages/tagManager/app/tag/RuleGroupCreate'),
) as FC<DialogPageProps>;

const RuleGroupDuplicate = dynamic(
    () => import('../dialogPages/tagManager/app/tag/RuleGroupDuplicate'),
) as FC<DialogPageProps>;

const RuleGroupOrderUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/tag/RuleGroupOrderUpdate'),
) as FC<DialogPageProps>;

const RuleGroupDelete = dynamic(
    () => import('../dialogPages/tagManager/app/tag/RuleGroupDelete'),
) as FC<DialogPageProps>;

const RuleGroupUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/tag/RuleGroupUpdate'),
) as FC<DialogPageProps>;

const RuleGroupHistory = dynamic(
    () => import('../dialogPages/tagManager/app/tag/RuleGroupHistory'),
) as FC<DialogPageProps>;

const ruleActions = {
    createRule: (pageActionProps: PageActionProps, id: string, tagId: string): void => {
        openDrawer(pageActionProps, RuleCreate, id, false, false, tagId);
    },
    duplicateRule: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, RuleDuplicate, id, false, false);
    },
    updateRuleOrder: (
        pageActionProps: PageActionProps,
        ruleGroupId: string,
        ids: string[],
    ): void => {
        launchHidden(pageActionProps, RuleOrderUpdate, ruleGroupId, ids);
    },
    deleteRule: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, RuleDelete, id, false, true);
    },
    updateRule: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, RuleUpdate, id, false);
    },
    showRuleHistory: (
        pageActionProps: PageActionProps,
        id: string,
        name: string,
        triggerId?: string,
    ): void => {
        openInfo(pageActionProps, RuleHistory, id, name, triggerId);
    },
    createRuleGroup: (pageActionProps: PageActionProps, tagId: string): void => {
        openDrawerContextOnly(pageActionProps, RuleGroupCreate, tagId, false);
    },
    duplicateRuleGroup: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, RuleGroupDuplicate, id, false);
    },
    updateRuleGroupOrder: (
        pageActionProps: PageActionProps,
        tagId: string,
        ids: string[],
    ): void => {
        launchHidden(pageActionProps, RuleGroupOrderUpdate, tagId, ids);
    },
    deleteRuleGroup: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, RuleGroupDelete, id, false, true);
    },
    updateRuleGroup: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, RuleGroupUpdate, id, false);
    },
    showRuleGroupHistory: (pageActionProps: PageActionProps, id: string, name: string): void => {
        openInfo(pageActionProps, RuleGroupHistory, id, name);
    },
};

export { ruleActions };
