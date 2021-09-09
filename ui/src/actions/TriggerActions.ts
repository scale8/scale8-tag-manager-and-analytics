import { PageActionProps } from './PageActions';
import {
    openDrawer,
    openDrawerContextOnly,
    openInfo,
    openLightbox,
    openLightboxNoRefresh,
    openLightboxWithName,
    openWideDrawer,
} from '../utils/PageActionUtils';
import { GlobalTriggerCreate } from '../dialogPages/tagManager/app/trigger/GlobalTriggerCreate';
import { GlobalTriggerUpdate } from '../dialogPages/tagManager/app/trigger/GlobalTriggerUpdate';
import { GlobalTriggerDuplicate } from '../dialogPages/tagManager/app/trigger/GlobalTriggerDuplicate';
import { GlobalTriggerDelete } from '../dialogPages/tagManager/app/trigger/GlobalTriggerDelete';
import { GlobalTriggerHistory } from '../dialogPages/tagManager/app/trigger/GlobalTriggerHistory';
import { EventCreate } from '../dialogPages/tagManager/app/trigger/EventCreate';
import { EventDelete } from '../dialogPages/tagManager/app/trigger/EventDelete';
import { EventInspect } from '../dialogPages/tagManager/app/trigger/EventInspect';
import { EventUpdate } from '../dialogPages/tagManager/app/trigger/EventUpdate';
import { EventHistory } from '../dialogPages/tagManager/app/trigger/EventHistory';
import { ConditionCreate } from '../dialogPages/tagManager/app/trigger/ConditionCreate';
import { ConditionDelete } from '../dialogPages/tagManager/app/trigger/ConditionDelete';
import { ConditionUpdate } from '../dialogPages/tagManager/app/trigger/ConditionUpdate';
import { ConditionHistory } from '../dialogPages/tagManager/app/trigger/ConditionHistory';
import { ExceptionCreate } from '../dialogPages/tagManager/app/trigger/ExceptionCreate';
import { ExceptionDelete } from '../dialogPages/tagManager/app/trigger/ExceptionDelete';
import { ExceptionUpdate } from '../dialogPages/tagManager/app/trigger/ExceptionUpdate';
import { ExceptionHistory } from '../dialogPages/tagManager/app/trigger/ExceptionHistory';

const triggerActions = {
    createGlobalTrigger: (pageActionProps: PageActionProps, revisionId: string): void => {
        openDrawerContextOnly(pageActionProps, GlobalTriggerCreate, revisionId);
    },
    updateGlobalTrigger: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, GlobalTriggerUpdate, id);
    },
    duplicateGlobalTrigger: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, GlobalTriggerDuplicate, id);
    },
    deleteGlobalTrigger: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, GlobalTriggerDelete, id);
    },
    showGlobalTriggerHistory: (
        pageActionProps: PageActionProps,
        id: string,
        name: string,
    ): void => {
        openInfo(pageActionProps, GlobalTriggerHistory, id, name);
    },
    createEvent: (pageActionProps: PageActionProps, triggerId: string): void => {
        openWideDrawer(pageActionProps, EventCreate, triggerId, false, false);
    },
    deleteEvent: (pageActionProps: PageActionProps, id: string, name: string): void => {
        openLightboxWithName(pageActionProps, EventDelete, id, name, false, true);
    },
    inspectEvent: (pageActionProps: PageActionProps, id: string): void => {
        openLightboxNoRefresh(pageActionProps, EventInspect, id);
    },
    updateEvent: (pageActionProps: PageActionProps, id: string, triggerId: string): void => {
        openWideDrawer(pageActionProps, EventUpdate, id, false, false, triggerId);
    },
    showEventHistory: (pageActionProps: PageActionProps, id: string, name: string): void => {
        openInfo(pageActionProps, EventHistory, id, name);
    },
    createCondition: (pageActionProps: PageActionProps, triggerId: string): void => {
        openWideDrawer(pageActionProps, ConditionCreate, triggerId, false, false);
    },
    deleteCondition: (pageActionProps: PageActionProps, id: string, name: string): void => {
        openLightboxWithName(pageActionProps, ConditionDelete, id, name, false, true);
    },
    updateCondition: (pageActionProps: PageActionProps, id: string, triggerId: string): void => {
        openWideDrawer(pageActionProps, ConditionUpdate, id, false, false, triggerId);
    },
    showConditionHistory: (pageActionProps: PageActionProps, id: string, name: string): void => {
        openInfo(pageActionProps, ConditionHistory, id, name);
    },
    createException: (pageActionProps: PageActionProps, triggerId: string): void => {
        openWideDrawer(pageActionProps, ExceptionCreate, triggerId, false, false);
    },
    deleteException: (pageActionProps: PageActionProps, id: string, name: string): void => {
        openLightboxWithName(pageActionProps, ExceptionDelete, id, name, false, true);
    },
    updateException: (pageActionProps: PageActionProps, id: string, triggerId: string): void => {
        openWideDrawer(pageActionProps, ExceptionUpdate, id, false, false, triggerId);
    },
    showExceptionHistory: (pageActionProps: PageActionProps, id: string, name: string): void => {
        openInfo(pageActionProps, ExceptionHistory, id, name);
    },
};

export { triggerActions };
