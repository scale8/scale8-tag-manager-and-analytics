import { Dispatch, FC, SetStateAction } from 'react';
import { ApolloError } from '@apollo/client';
import { DialogPageProps } from '../types/DialogTypes';
import { DialogAction } from './DialogReducer';
import { OrgUserAction, OrgUserState } from './OrgUserReducer';
import { SectionKey } from '../containers/SectionsDetails';

export type AskInteraction = (text: string, confirmHandler: () => void) => void;

export type DialogPayload = {
    pageComponent?: FC<DialogPageProps> | null;
    secondaryPageComponent?: FC;
    secondaryDialogValues?: Record<string, unknown>;
    pageWidth?: number;
    refresh?: () => void;
    followUp?: (
        id: string,
        pageRefresh: () => void,
        handleDialogClose: (checkChanges: boolean) => void,
    ) => void;
    pageHasChanges?: boolean;
    contentId?: string;
    contextId?: string;
    name?: string;
    ids?: string[];
    readOnly?: boolean;
};

export type DialogState = DialogPayload & {
    pageComponent: FC<DialogPageProps> | null;
    type: 'drawer' | 'info' | 'fullscreen' | 'lightbox' | 'hidden';
};

export type LoggedInTemplateInteractions = {
    ask: AskInteraction;
    dialogState: DialogState;
    dispatchDialogAction: Dispatch<DialogAction>;
    snackbarError: ApolloError | null;
    setSnackbarError: Dispatch<SetStateAction<ApolloError | null>>;
    refreshCurrentPage: boolean;
    setRefreshCurrentPage: Dispatch<SetStateAction<boolean>>;
    refreshCurrentSection: boolean;
    setRefreshCurrentSection: Dispatch<SetStateAction<boolean>>;
    section: symbol;
    setSection: Dispatch<SetStateAction<symbol>>;
    sectionHasAnalytics: boolean;
    setSectionHasAnalytics: Dispatch<SetStateAction<boolean>>;
};

export type LoggedInUserState = {
    loggedUserId: string;
    userIsAdmin: boolean;
    invites: number;
    notifications: number;
};

export type LoggedInState = {
    templateInteractions: LoggedInTemplateInteractions;
    loggedInUserState: LoggedInUserState;
    orgUserState: OrgUserState | null;
    dispatchOrgUserAction: Dispatch<OrgUserAction>;
    gates: Record<string, JSX.Element>;
    teleport: (gateName: string, element: JSX.Element) => void;
};

const idleFunction = (): void => {
    // Idle
};

export const dialogInit = (): DialogState => ({
    pageComponent: null,
    type: 'hidden',
});

export const initialTemplateInteractions = {
    ask: idleFunction,
    dialogState: dialogInit(),
    dispatchDialogAction: idleFunction,
    snackbarError: null,
    setSnackbarError: idleFunction,
    refreshCurrentPage: false,
    setRefreshCurrentPage: idleFunction,
    refreshCurrentSection: false,
    setRefreshCurrentSection: idleFunction,
    section: SectionKey.loggedOut,
    setSection: idleFunction,
    sectionHasAnalytics: false,
    setSectionHasAnalytics: idleFunction,
};

export const loggedInInitialState = {
    templateInteractions: initialTemplateInteractions,
    loggedInUserState: {
        userIsAdmin: false,
        loggedUserId: '',
        invites: 0,
        notifications: 0,
    },
    orgUserState: null,
    dispatchOrgUserAction: idleFunction,
    gates: {},
    teleport: idleFunction,
};
