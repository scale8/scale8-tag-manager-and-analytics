import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openDrawerContextOnly,
    openInfo,
    openLightbox,
} from '../utils/PageActionUtils';
import { RuleCreate } from '../dialogPages/tagManager/app/tag/RuleCreate';
import { RuleDuplicate } from '../dialogPages/tagManager/app/tag/RuleDuplicate';
import { RuleOrderUpdate } from '../dialogPages/tagManager/app/tag/RuleOrderUpdate';
import { RuleDelete } from '../dialogPages/tagManager/app/tag/RuleDelete';
import { RuleUpdate } from '../dialogPages/tagManager/app/tag/RuleUpdate';
import { RuleHistory } from '../dialogPages/tagManager/app/tag/RuleHistory';
import { RuleGroupCreate } from '../dialogPages/tagManager/app/tag/RuleGroupCreate';
import { RuleGroupDuplicate } from '../dialogPages/tagManager/app/tag/RuleGroupDuplicate';
import { RuleGroupOrderUpdate } from '../dialogPages/tagManager/app/tag/RuleGroupOrderUpdate';
import { RuleGroupDelete } from '../dialogPages/tagManager/app/tag/RuleGroupDelete';
import { RuleGroupUpdate } from '../dialogPages/tagManager/app/tag/RuleGroupUpdate';
import { RuleGroupHistory } from '../dialogPages/tagManager/app/tag/RuleGroupHistory';

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
