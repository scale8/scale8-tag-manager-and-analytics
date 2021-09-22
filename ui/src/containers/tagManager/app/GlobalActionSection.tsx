import { FC } from 'react';
import { useQuery } from '@apollo/client';
import {
    buildAppButtonProps,
    buildAppRevisionButtonProps,
    buildGlobalActionButtonProps,
    buildOrgButtonProps,
    buildTagManagerButtonProps,
} from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../../abstractions/Section';
import NavGlobalActionQuery from '../../../gql/queries/NavGlobalActionQuery';
import { NavGlobalAction } from '../../../gql/generated/NavGlobalAction';
import { buildAppRevisionBreadcrumbActions } from '../../../utils/BuildAppRevisionBreadcrumbActions';
import { extractPermissionsFromOrgUser } from '../../../context/OrgUserReducer';
import { SectionKey } from '../../SectionsDetails';
import { useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';
import { analyticsEnabled } from '../../../utils/AnalyticsUtils';

const GlobalActionSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState, templateInteractions } = useLoggedInState();

    const { ask, dispatchDialogAction, setRefreshCurrentPage, sectionHistory } =
        templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const sectionProps: SectionProps<NavGlobalAction> = {
        children,
        sectionKey: SectionKey.globalAction,
        queryResult: useQuery<NavGlobalAction>(NavGlobalActionQuery, {
            variables: { id },
        }),
        initContext: (data) => {
            templateInteractions.setSectionHasAnalytics(
                analyticsEnabled(data.getActionGroupDistribution.revision.app),
            );
        },
        buildButtonsProps: (data) => [
            buildOrgButtonProps(
                router,
                data.me.orgs,
                data.getActionGroupDistribution.revision.app.tag_manager_account.org.id,
                data.getActionGroupDistribution.revision.app.tag_manager_account.org.name,
            ),
            buildTagManagerButtonProps(
                router,
                data.getActionGroupDistribution.revision.app.tag_manager_account.id,
                data.getActionGroupDistribution.revision.app.tag_manager_account.org
                    .data_manager_account?.id ?? '',
            ),
            buildAppButtonProps(
                router,
                data.getActionGroupDistribution.revision.app.tag_manager_account.apps,
                data.getActionGroupDistribution.revision.app.id,
                data.getActionGroupDistribution.revision.app.name,
            ),
            buildAppRevisionButtonProps(
                router,
                data.getActionGroupDistribution.revision.app.revisions,
                data.getActionGroupDistribution.revision.id,
                data.getActionGroupDistribution.revision.name,
            ),
            buildGlobalActionButtonProps(
                router,
                data.getActionGroupDistribution.revision.global_action_group_distributions,
                id,
                data.getActionGroupDistribution.name,
                true,
            ),
        ],
        buildMenuItemsProps: () => [],
        extractOrgUserDetails: (data) =>
            data.getActionGroupDistribution.revision.app.tag_manager_account.org,
        buildBreadcrumbActions: (data) =>
            buildAppRevisionBreadcrumbActions(
                data.getActionGroupDistribution.revision.id,
                data.getActionGroupDistribution.revision.name,
                router,
                currentOrgPermissions,
                dispatchDialogAction,
                setRefreshCurrentPage,
                ask,
                data.getActionGroupDistribution.revision.locked,
                sectionHistory,
            ),
        accountExpireIn: orgUserState?.tagManagerAccount?.trialExpiration ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount?.isTrial ?? undefined,
    };

    return <Section<NavGlobalAction> {...sectionProps} />;
};

export default GlobalActionSection;
