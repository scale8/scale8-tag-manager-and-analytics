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
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const GlobalTriggerCreate = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/GlobalTriggerCreate'),
) as FC<DialogPageProps>;

const GlobalTriggerUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/GlobalTriggerUpdate'),
) as FC<DialogPageProps>;

const GlobalTriggerDuplicate = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/GlobalTriggerDuplicate'),
) as FC<DialogPageProps>;

const GlobalTriggerDelete = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/GlobalTriggerDelete'),
) as FC<DialogPageProps>;

const GlobalTriggerHistory = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/GlobalTriggerHistory'),
) as FC<DialogPageProps>;

const EventCreate = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/EventCreate'),
) as FC<DialogPageProps>;

const EventDelete = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/EventDelete'),
) as FC<DialogPageProps>;

const EventInspect = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/EventInspect'),
) as FC<DialogPageProps>;

const EventUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/EventUpdate'),
) as FC<DialogPageProps>;

const EventHistory = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/EventHistory'),
) as FC<DialogPageProps>;

const ConditionCreate = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/ConditionCreate'),
) as FC<DialogPageProps>;

const ConditionDelete = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/ConditionDelete'),
) as FC<DialogPageProps>;

const ConditionUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/ConditionUpdate'),
) as FC<DialogPageProps>;

const ConditionHistory = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/ConditionHistory'),
) as FC<DialogPageProps>;

const ExceptionCreate = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/ExceptionCreate'),
) as FC<DialogPageProps>;

const ExceptionDelete = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/ExceptionDelete'),
) as FC<DialogPageProps>;

const ExceptionUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/ExceptionUpdate'),
) as FC<DialogPageProps>;

const ExceptionHistory = dynamic(
    () => import('../dialogPages/tagManager/app/trigger/ExceptionHistory'),
) as FC<DialogPageProps>;

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
