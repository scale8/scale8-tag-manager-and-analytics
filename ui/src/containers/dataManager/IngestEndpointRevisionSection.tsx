import { FC } from 'react';
import { useQuery } from '@apollo/client';
import NavIngestEndpointRevisionQuery from '../../gql/queries/NavIngestEndpointRevisionQuery';
import { NavIngestEndpointRevision } from '../../gql/generated/NavIngestEndpointRevision';
import { buildIngestEndpointRevisionButtonProps } from '../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../abstractions/Section';
import { buildDuplicateAction } from '../../utils/TableActionsUtils';
import { pageActions } from '../../actions/PageActions';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import { SectionKey } from '../SectionsDetails';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import { useRouter } from 'next/router';
import { toIngestEndpointRevision } from '../../utils/NavigationPaths';
import { ChildrenAndIdProps } from '../../types/props/ChildrenAndIdProps';
import { analyticsEnabled } from '../../utils/AnalyticsUtils';
import { buildIngestEndpointsButtons } from './IngestEndpointSection';

const IngestEndpointRevisionSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();
    const { id, children } = props;

    const { templateInteractions, orgUserState } = useLoggedInState();
    const { useSignup } = useConfigState();

    const { dispatchDialogAction } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const sectionProps: SectionProps<NavIngestEndpointRevision> = {
        children,
        sectionKey: SectionKey.ingestEndpointRevision,
        queryResult: useQuery<NavIngestEndpointRevision>(NavIngestEndpointRevisionQuery, {
            variables: { id },
        }),
        sectionHasAnalytics: (data) =>
            analyticsEnabled(data.getIngestEndpointRevision.ingest_endpoint),
        buildButtonsProps: (data, orgPermissions) => [
            ...buildIngestEndpointsButtons(
                data.me.orgs,
                data.getIngestEndpointRevision.ingest_endpoint.data_manager_account.org,
                data.getIngestEndpointRevision.ingest_endpoint.data_manager_account,
                data.getIngestEndpointRevision.ingest_endpoint.data_manager_account.org
                    .tag_manager_account,
                data.getIngestEndpointRevision.ingest_endpoint.data_manager_account
                    .ingest_endpoints,
                data.getIngestEndpointRevision.ingest_endpoint,
                analyticsEnabled(data.getIngestEndpointRevision.ingest_endpoint),
                router,
                orgPermissions,
                useSignup,
                'Revisions',
            ),
            buildIngestEndpointRevisionButtonProps(
                router,
                data.getIngestEndpointRevision.ingest_endpoint.ingest_endpoint_revisions,
                id,
                data.getIngestEndpointRevision.name,
                true,
            ),
        ],
        buildMenuItemsProps: () => [],
        extractOrgUserDetails: (data) =>
            data.getIngestEndpointRevision.ingest_endpoint.data_manager_account.org,
        buildBreadcrumbActions: () => [
            buildDuplicateAction(
                () =>
                    pageActions.duplicateIngestEndpointRevision(
                        {
                            dispatchDialogAction,
                        },
                        id,
                        (
                            id: string,
                            pageRefresh: () => void,
                            handleDialogClose: (checkChanges: boolean) => void,
                        ) => {
                            handleDialogClose(false);
                            router.push(toIngestEndpointRevision({ id })).then();
                        },
                    ),
                `Duplicate Revision`,
                () => !currentOrgPermissions.canCreate,
            ),
        ],
        accountExpireIn: orgUserState?.dataManagerAccount.trialExpiration ?? undefined,
        accountExpired: orgUserState?.dataManagerAccount.trialExpired ?? undefined,
        accountIsTrial: orgUserState?.dataManagerAccount.isTrial ?? undefined,
    };

    return <Section<NavIngestEndpointRevision> {...sectionProps} />;
};

export default IngestEndpointRevisionSection;
