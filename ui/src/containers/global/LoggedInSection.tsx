import * as React from 'react';
import { FC, MouseEventHandler, useEffect, useReducer, useState } from 'react';
import LoggedInTemplate from '../../components/templates/containers/LoggedInTemplate';
import { ApolloError, useQuery } from '@apollo/client';
import { LoggedUser } from '../../gql/generated/LoggedUser';
import LoggedUserQuery from '../../gql/queries/LoggedUserQuery';
import { createHash } from 'crypto';
import { useCancelConfirmDialog } from '../../hooks/dialog/useCancelConfirmDialog';
import { CancelConfirmDialogProps } from '../../types/props/CancelConfirmDialogProps';
import { pageActions } from '../../actions/PageActions';
import { dialogReducer } from '../../context/DialogReducer';
import { orgUserReducer } from '../../context/OrgUserReducer';
import GithubCheck from '../../dialogPages/global/GithubCheck';
import { ChildrenOnlyProps } from '../../types/props/ChildrenOnlyProps';
import Navigate from '../../components/atoms/Next/Navigate';
import { dialogInit } from '../../context/LoggedInState';
import { useAppContext } from '../../context/AppContext';
import Loader from '../../components/organisms/Loader';
import { configStateFromData } from '../../context/ConfigState';
import { SectionKey } from '../SectionsDetails';

export type UserSelectorProps = {
    loading: boolean;
    imgSrc?: string;
    userName: string;
    userEmail: string;
    handleAccountClick: MouseEventHandler;
    handleLogoutClick: MouseEventHandler;
};

export type SideBarProps = {
    handleNotificationClick: MouseEventHandler;
    children?: React.ReactNode;
    userSelectorProps: UserSelectorProps;
    isAdmin: boolean;
    unreadNotifications: number;
};

export type LoggedInProps = {
    sideBarProps: SideBarProps;
    children: React.ReactNode;
    breadcrumb: React.ReactNode;
    sideMenu: React.ReactNode;
    cancelConfirmDialogProps: CancelConfirmDialogProps;
};

const LoggedInSection: FC<ChildrenOnlyProps> = (props: ChildrenOnlyProps) => {
    const { setState, loggedInState, configState } = useAppContext();

    const [logOut, setLogOut] = useState(false);

    const [dialogState, dispatchDialogAction] = useReducer(dialogReducer, null, dialogInit);

    const [refreshCurrentPage, setRefreshCurrentPage] = useState(false);
    const [refreshCurrentSection, setRefreshCurrentSection] = useState(false);

    const [snackbarError, setSnackbarError] = useState<ApolloError | null>(null);

    const [orgUserState, dispatchOrgUserAction] = useReducer(orgUserReducer, null);

    const [section, setSection] = useState<symbol>(SectionKey.loggedOut);

    const [sectionHasAnalytics, setSectionHasAnalytics] = useState(false);

    const [gates, dispatchGatesAction] = useReducer(
        (
            state: Record<string, JSX.Element>,
            action: { type: 'set'; payload: { gateName: string; element: JSX.Element } },
        ): Record<string, JSX.Element> => {
            return { ...state, [action.payload.gateName]: action.payload.element };
        },
        {},
    );

    const teleport = (gateName: string, element: JSX.Element) => {
        dispatchGatesAction({ type: 'set', payload: { gateName, element } });
    };

    const { loading, error, data, ...queryResult } = useQuery<LoggedUser>(LoggedUserQuery);

    // Single Question Dialog
    const { dialogProps: cancelConfirmDialogProps, ask } = useCancelConfirmDialog();

    useEffect(() => {
        setState({
            loggedInState: {
                templateInteractions: {
                    ask,
                    dialogState,
                    dispatchDialogAction,
                    snackbarError,
                    setSnackbarError,
                    refreshCurrentPage,
                    setRefreshCurrentPage,
                    refreshCurrentSection,
                    setRefreshCurrentSection,
                    section,
                    setSection,
                    sectionHasAnalytics,
                    setSectionHasAnalytics,
                },
                loggedInUserState: {
                    loggedUserId: data?.me.id ?? '',
                    userIsAdmin: !!data?.me.is_admin,
                    invites: data ? data.me.invites.length : 0,
                    notifications: data ? data.me.user_notifications.length : 0,
                },
                orgUserState,
                dispatchOrgUserAction,
                gates,
                teleport,
            },
            configState: configStateFromData(data),
        });
    }, [
        data,
        dialogState,
        refreshCurrentPage,
        refreshCurrentSection,
        snackbarError,
        orgUserState,
        section,
    ]);

    if (error || logOut) {
        return <Navigate to="/login" />;
    }

    if (loading || loggedInState === undefined || configState === undefined) {
        return <Loader />;
    }

    const gravatarHash = createHash('md5')
        .update(data ? data.me.email.trim().toLowerCase() : '')
        .digest('hex');

    const userSelectorProps: UserSelectorProps = {
        imgSrc: `https://www.gravatar.com/avatar/${gravatarHash}?s=100&d=identicon`,
        loading,
        userName: `${data?.me.first_name} ${data?.me.last_name}`,
        userEmail: `${data?.me.email}`,
        handleAccountClick: () => {
            pageActions.manageAccount({
                dispatchDialogAction,
                refresh: () => {
                    (async () => {
                        await queryResult.refetch();
                    })();
                },
            });
        },
        handleLogoutClick: () => {
            localStorage.removeItem('uid');
            localStorage.removeItem('token');
            setLogOut(true);
        },
    };

    const sideBarProps: SideBarProps = {
        handleNotificationClick: () => {
            pageActions.showNotification({
                dispatchDialogAction,
            });
        },
        userSelectorProps,
        isAdmin: data ? data.me.is_admin : false,
        unreadNotifications: data ? data.me.invites.length + data.me.user_notifications.length : 0,
    };

    return (
        <>
            <GithubCheck
                githubUser={data?.me.github_user ?? null}
                githubConnected={data?.me.github_connected ?? false}
            />
            <LoggedInTemplate
                sideBarProps={sideBarProps}
                breadcrumb={gates['breadcrumb'] ?? <></>}
                sideMenu={gates['side'] ?? <></>}
                cancelConfirmDialogProps={cancelConfirmDialogProps}
            >
                {props.children}
            </LoggedInTemplate>
        </>
    );
};

export default LoggedInSection;
