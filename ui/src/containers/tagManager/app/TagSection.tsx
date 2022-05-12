import { FC } from 'react';
import { useQuery } from '@apollo/client';
import NavTagQuery from '../../../gql/queries/NavTagQuery';
import { NavTag } from '../../../gql/generated/NavTag';
import { buildTagButtonProps } from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../../abstractions/Section';
import { buildAppRevisionBreadcrumbActions } from '../../../utils/BuildAppRevisionBreadcrumbActions';
import { extractPermissionsFromOrgUser } from '../../../context/OrgUserReducer';
import { SectionKey } from '../../SectionsDetails';
import { useConfigState, useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';
import { analyticsEnabled, errorTrackingEnabled } from '../../../utils/AnalyticsUtils';
import { buildAppRevisionButtons } from './AppRevisionSection';

const TagSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const { orgUserState, templateInteractions } = useLoggedInState();
    const { useSignup } = useConfigState();

    const { ask, dispatchDialogAction, setRefreshCurrentPage } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const sectionProps: SectionProps<NavTag> = {
        children,
        sectionKey: SectionKey.tag,
        queryResult: useQuery<NavTag>(NavTagQuery, {
            variables: { id },
        }),
        sectionHasAnalytics: (data) => analyticsEnabled(data.getTag.revision.app),
        buildButtonsProps: (data, orgPermissions) => [
            ...buildAppRevisionButtons(
                data.me.orgs,
                data.getTag.revision.app.tag_manager_account.org,
                data.getTag.revision.app.tag_manager_account,
                data.getTag.revision.app.tag_manager_account.org.data_manager_account,
                data.getTag.revision.app.tag_manager_account.apps,
                data.getTag.revision.app,
                data.getTag.revision.app.revisions,
                data.getTag.revision,
                analyticsEnabled(data.getTag.revision.app),
                errorTrackingEnabled(data.getTag.revision.app),
                router,
                orgPermissions,
                useSignup,
                'Tags',
            ),
            buildTagButtonProps(router, data.getTag.revision.tags, id, data.getTag.name, true),
        ],
        buildMenuItemsProps: () => [],
        extractOrgUserDetails: (data) => data.getTag.revision.app.tag_manager_account.org,
        buildBreadcrumbActions: (data) =>
            buildAppRevisionBreadcrumbActions(
                data.getTag.revision.id,
                data.getTag.revision.name,
                router,
                currentOrgPermissions,
                dispatchDialogAction,
                setRefreshCurrentPage,
                ask,
                data.getTag.revision.locked,
            ),
        accountExpireIn: orgUserState?.tagManagerAccount.trialExpiration ?? undefined,
        accountExpired: orgUserState?.tagManagerAccount.trialExpired ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount.isTrial ?? undefined,
    };

    return <Section<NavTag> {...sectionProps} />;
};

export default TagSection;
