import { FC } from 'react';
import { useQuery } from '@apollo/client';
import NavGlobalTriggerQuery from '../../../gql/queries/NavGlobalTriggerQuery';
import { NavGlobalTrigger } from '../../../gql/generated/NavGlobalTrigger';
import { buildGlobalTriggerButtonProps } from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../../abstractions/Section';
import { buildAppRevisionBreadcrumbActions } from '../../../utils/BuildAppRevisionBreadcrumbActions';
import { extractPermissionsFromOrgUser } from '../../../context/OrgUserReducer';
import { SectionKey } from '../../SectionsDetails';
import { useConfigState, useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';
import { analyticsEnabled } from '../../../utils/AnalyticsUtils';
import { buildAppRevisionButtons } from './AppRevisionSection';

const GlobalTriggerSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState, templateInteractions } = useLoggedInState();
    const { useSignup } = useConfigState();

    const { ask, dispatchDialogAction, setRefreshCurrentPage } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const sectionProps: SectionProps<NavGlobalTrigger> = {
        children,
        sectionKey: SectionKey.globalTrigger,
        queryResult: useQuery<NavGlobalTrigger>(NavGlobalTriggerQuery, {
            variables: { id },
        }),
        initContext: (data) => {
            templateInteractions.setSectionHasAnalytics(
                analyticsEnabled(data.getTrigger.revision.app),
            );
        },
        buildButtonsProps: (data, orgPermissions) => [
            ...buildAppRevisionButtons(
                data.me.orgs,
                data.getTrigger.revision.app.tag_manager_account.org,
                data.getTrigger.revision.app.tag_manager_account,
                data.getTrigger.revision.app.tag_manager_account.org.data_manager_account,
                data.getTrigger.revision.app.tag_manager_account.apps,
                data.getTrigger.revision.app,
                data.getTrigger.revision.app.revisions,
                data.getTrigger.revision,
                analyticsEnabled(data.getTrigger.revision.app),
                data.getTrigger.revision.app.error_tracking_enabled,
                router,
                orgPermissions,
                useSignup,
                'Global Triggers',
            ),
            buildGlobalTriggerButtonProps(
                router,
                data.getTrigger.revision.global_triggers,
                id,
                data.getTrigger.name,
                true,
            ),
        ],
        buildMenuItemsProps: () => [],
        extractOrgUserDetails: (data) => data.getTrigger.revision.app.tag_manager_account.org,
        buildBreadcrumbActions: (data) =>
            buildAppRevisionBreadcrumbActions(
                data.getTrigger.revision.id,
                data.getTrigger.revision.name,
                router,
                currentOrgPermissions,
                dispatchDialogAction,
                setRefreshCurrentPage,
                ask,
                data.getTrigger.revision.locked,
            ),
        accountExpireIn: orgUserState?.tagManagerAccount?.trialExpiration ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount?.isTrial ?? undefined,
    };

    return <Section<NavGlobalTrigger> {...sectionProps} />;
};

export default GlobalTriggerSection;
