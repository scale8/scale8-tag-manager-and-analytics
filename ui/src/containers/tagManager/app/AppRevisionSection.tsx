import { FC } from 'react';
import { useQuery } from '@apollo/client';
import TagIcon from '../../../components/atoms/Icons/TagIcon';
import PlatformRevisionIcon from '../../../components/atoms/Icons/PlatformRevisionIcon';
import NavAppRevisionQuery from '../../../gql/queries/NavAppRevisionQuery';
import { NavAppRevision } from '../../../gql/generated/NavAppRevision';
import {
    buildAppButtonProps,
    buildAppRevisionButtonProps,
    buildOrgButtonProps,
    buildTagManagerButtonProps,
} from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../../abstractions/Section';
import ActionIcon from '../../../components/atoms/Icons/ActionIcon';
import TriggerIcon from '../../../components/atoms/Icons/TriggerIcon';
import { buildAppRevisionBreadcrumbActions } from '../../../utils/BuildAppRevisionBreadcrumbActions';
import { extractPermissionsFromOrgUser } from '../../../context/OrgUserReducer';
import { SectionKey } from '../../SectionsDetails';
import { useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';
import { toAppRevision } from '../../../utils/NavigationPaths';
import { analyticsEnabled } from '../../../utils/AnalyticsUtils';

const AppRevisionSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState, templateInteractions } = useLoggedInState();
    const { ask, dispatchDialogAction, setRefreshCurrentPage, sectionHistory } =
        templateInteractions;

    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const sectionProps: SectionProps<NavAppRevision> = {
        children,
        sectionKey: SectionKey.appRevision,
        queryResult: useQuery<NavAppRevision>(NavAppRevisionQuery, {
            variables: { id },
        }),
        initContext: (data) => {
            templateInteractions.setSectionHasAnalytics(analyticsEnabled(data.getRevision.app));
        },
        buildButtonsProps: (data) => [
            buildOrgButtonProps(
                router,
                data.me.orgs,
                data.getRevision.app.tag_manager_account.org.id,
                data.getRevision.app.tag_manager_account.org.name,
            ),
            buildTagManagerButtonProps(
                router,
                data.getRevision.app.tag_manager_account.id,
                data.getRevision.app.tag_manager_account.org.data_manager_account?.id ?? '',
            ),
            buildAppButtonProps(
                router,
                data.getRevision.app.tag_manager_account.apps,
                data.getRevision.app.id,
                data.getRevision.app.name,
            ),
            buildAppRevisionButtonProps(
                router,
                data.getRevision.app.revisions,
                id,
                data.getRevision.name,
                true,
            ),
        ],
        buildMenuItemsProps: () => [
            {
                icon: () => <TagIcon />,
                label: 'Tags',
                link: toAppRevision({ id }, 'tags'),
            },
            {
                icon: () => <TriggerIcon />,
                label: 'Global Triggers',
                link: toAppRevision({ id }, 'global-triggers'),
            },
            {
                icon: () => <ActionIcon />,
                label: 'Global Actions',
                link: toAppRevision({ id }, 'global-actions'),
            },
            {
                icon: () => <PlatformRevisionIcon />,
                label: 'Platform Revisions',
                link: toAppRevision({ id }, 'app-platform-revisions'),
            },
        ],
        extractOrgUserDetails: (data) => data.getRevision.app.tag_manager_account.org,
        buildBreadcrumbActions: (data) =>
            buildAppRevisionBreadcrumbActions(
                id,
                data.getRevision.name,
                router,
                currentOrgPermissions,
                dispatchDialogAction,
                setRefreshCurrentPage,
                ask,
                data.getRevision.locked,
                sectionHistory,
            ),
        accountExpireIn: orgUserState?.tagManagerAccount?.trialExpiration ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount?.isTrial ?? undefined,
    };

    return <Section<NavAppRevision> {...sectionProps} />;
};

export default AppRevisionSection;
