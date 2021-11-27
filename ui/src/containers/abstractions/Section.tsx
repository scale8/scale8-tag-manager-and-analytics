import { ReactElement, ReactNode, useEffect } from 'react';
import { BreadcrumbButtonProps } from '../../utils/BreadcrumbButtonsUtils';
import { QueryResult } from '@apollo/client/react/types/types';
import { PageMenuButtonProps } from '../../components/molecules/SideMenuButton';
import { RowAction } from '../../components/molecules/S8Table/S8TableTypes';
import {
    CurrentOrgPermissions,
    extractPermissionsFromOrgUser,
    GqlOrgUserState,
    OrgUserStateFromGql,
} from '../../context/OrgUserReducer';
import { getSectionDetails, ProductSectionKey } from '../SectionsDetails';
import { ApolloError } from '@apollo/client/errors';
import { useLoggedInState } from '../../context/AppContext';
import { toOrg } from '../../utils/NavigationPaths';
import { useRouter } from 'next/router';
import Breadcrumb from '../../components/organisms/Breadcrumb';
import SideMenu from '../../components/organisms/SideMenu';
import Loader from '../../components/organisms/Loader';
import GQLError from '../../components/atoms/GqlError';

export type SectionItem = {
    id: string;
    name: string;
};

export type SectionProps<Q> = {
    children?: ReactNode;
    sectionKey: symbol;
    queryResult: QueryResult<Q>;
    initContext?: (data: Q) => void;
    buildButtonsProps: (data: Q, orgPermissions: CurrentOrgPermissions) => BreadcrumbButtonProps[];
    buildMenuItemsProps: (data: Q, orgPermissions: CurrentOrgPermissions) => PageMenuButtonProps[];
    extractOrgUserDetails: (data: Q) => GqlOrgUserState;
    buildBreadcrumbActions?: (data: Q) => RowAction<any>[];
    requireValidTagManagerAccount?: boolean;
    requireValidDataManagerAccount?: boolean;
    accountExpireIn?: number;
    accountIsTrial?: boolean;
};

const Section = <Q extends { [key: string]: any }>(props: SectionProps<Q>): ReactElement => {
    const {
        sectionKey,
        extractOrgUserDetails,
        queryResult,
        buildButtonsProps,
        buildMenuItemsProps,
        buildBreadcrumbActions,
        accountExpireIn,
        accountIsTrial,
        initContext,
    } = props;

    const sectionDetails = getSectionDetails(sectionKey);

    const router = useRouter();

    const { templateInteractions, orgUserState, dispatchOrgUserAction, teleport } =
        useLoggedInState();
    const {
        setSnackbarError,
        refreshCurrentSection,
        setRefreshCurrentSection,
        dispatchSectionAction,
    } = templateInteractions;

    const { loading, error, data } = queryResult;

    const valuesRefresh = (mustResetCache: boolean) => {
        (async () => {
            if (mustResetCache) {
                await queryResult.client.cache.reset();
            }
            await queryResult.refetch();
        })();
    };

    useEffect(() => {
        dispatchSectionAction({
            type: 'section',
            payload: sectionKey,
        });
    }, [sectionKey]);

    useEffect(() => {
        if (refreshCurrentSection) {
            valuesRefresh(true);
            setRefreshCurrentSection(false);
        }
    }, [refreshCurrentSection]);

    useEffect(() => {
        if (data !== undefined && data !== null) {
            const orgUserDetails = extractOrgUserDetails(data);
            const OrgUserState = OrgUserStateFromGql(orgUserDetails);
            dispatchOrgUserAction({
                type: 'setOrgUserState',
                payload: OrgUserState,
            });

            const determineAccountToCheck = (): string => {
                if (sectionDetails.productSectionKey === ProductSectionKey.dataManager) {
                    return 'Data Manager';
                }
                if (sectionDetails.productSectionKey === ProductSectionKey.tagManager) {
                    return 'Tag Manager';
                }
                return 'noCheck';
            };

            const accountToCheck = determineAccountToCheck();

            const leaveProductSection = (message: string): void => {
                setSnackbarError({
                    message,
                } as ApolloError);
                router.push(toOrg({ id: OrgUserState.orgId })).then();
            };

            if (accountToCheck !== 'noCheck') {
                const account =
                    accountToCheck === 'Data Manager'
                        ? OrgUserState.dataManagerAccount
                        : OrgUserState.tagManagerAccount;
                if (account === null) {
                    leaveProductSection(`${accountToCheck} Account is not active`);
                }
            }
        }
    }, [dispatchOrgUserAction, data]);

    useEffect(() => {
        if (refreshCurrentSection) {
            valuesRefresh(true);
            setRefreshCurrentSection(false);
        }
    }, [refreshCurrentSection]);

    useEffect(() => {
        if (initContext && data) {
            initContext(data);
        }
    }, [initContext, data]);

    const orgPermissions = extractPermissionsFromOrgUser(orgUserState);
    const buttonsProps = data ? buildButtonsProps(data, orgPermissions) : [];
    const menuItemsProps = data ? buildMenuItemsProps(data, orgPermissions) : [];
    const breadcrumbActions =
        !data || buildBreadcrumbActions === undefined ? [] : buildBreadcrumbActions(data);

    useEffect(() => {
        if (buttonsProps.length > 0) {
            teleport(
                'breadcrumb',
                <Breadcrumb
                    entityName={sectionDetails.entityName}
                    valuesRefresh={valuesRefresh}
                    buttonsProps={buttonsProps}
                    breadcrumbActions={breadcrumbActions}
                    accountExpireIn={accountExpireIn}
                    accountIsTrial={accountIsTrial}
                />,
            );
        } else {
            teleport('breadcrumb', <></>);
        }

        if (menuItemsProps.length > 0) {
            teleport('side', <SideMenu menuItemsProps={menuItemsProps} />);
        } else {
            teleport('side', <></>);
        }
    }, [buttonsProps, menuItemsProps, breadcrumbActions]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <GQLError error={error} />;
    }

    return <>{props.children}</>;
};

export { Section };
