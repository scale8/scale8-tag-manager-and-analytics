import { FC } from 'react';
import RevisionIcon from '../../components/atoms/Icons/RevisionIcon';
import EnvironmentIcon from '../../components/atoms/Icons/EnvironmentIcon';
import { useQuery } from '@apollo/client';
import { NavIngestEndpoint } from '../../gql/generated/NavIngestEndpoint';
import NavIngestEndpointQuery from '../../gql/queries/NavIngestEndpointQuery';
import {
    BreadcrumbButtonProps,
    buildIngestEndpointButtonProps,
    buildTabButtonProps,
} from '../../utils/BreadcrumbButtonsUtils';
import { Section, SectionItem, SectionProps } from '../abstractions/Section';
import { SectionKey } from '../SectionsDetails';
import IngestAnalyticsIcon from '../../components/atoms/Icons/IngestAnalyticsIcon';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import { NextRouter, useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../types/props/ChildrenAndIdProps';
import { toIngestEndpoint } from '../../utils/NavigationPaths';
import { analyticsEnabled } from '../../utils/AnalyticsUtils';
import { PageMenuButtonProps } from '../../components/molecules/SideMenuButton';
import { CurrentOrgPermissions } from '../../context/OrgUserReducer';
import { buildDataManagerButtons } from './DataManagerSection';

export const buildIngestEndpointTabsMenu = (
    id: string,
    analyticsEnabled: boolean,
): PageMenuButtonProps[] => {
    return [
        ...((analyticsEnabled
            ? [
                  {
                      icon: () => <IngestAnalyticsIcon />,
                      label: 'Analytics',
                      link: toIngestEndpoint({ id }, 'analytics'),
                  },
              ]
            : []) as PageMenuButtonProps[]),
        {
            icon: () => <RevisionIcon />,
            label: 'Revisions',
            link: toIngestEndpoint({ id }, 'revisions'),
        },
        {
            icon: () => <EnvironmentIcon />,
            label: 'Environments',
            link: toIngestEndpoint({ id }, 'environments'),
        },
    ];
};

export const buildIngestEndpointsButtons = (
    orgs: SectionItem[],
    currentOrg: SectionItem,
    tagManagerId: string,
    dataManagerId: string,
    ingestEndpoints: SectionItem[],
    currentIngestEndpoint: SectionItem,
    analyticsEnabled: boolean,
    router: NextRouter,
    orgPermissions: CurrentOrgPermissions,
    useSignup: boolean,
    forceCurrentEntry?: string,
): BreadcrumbButtonProps[] => [
    ...buildDataManagerButtons(
        orgs,
        currentOrg,
        tagManagerId,
        dataManagerId,
        router,
        orgPermissions,
        useSignup,
    ),
    buildIngestEndpointButtonProps(
        router,
        ingestEndpoints,
        currentIngestEndpoint.id,
        currentIngestEndpoint.name,
        forceCurrentEntry === undefined,
    ),
    buildTabButtonProps(
        router,
        buildIngestEndpointTabsMenu(currentIngestEndpoint.id, analyticsEnabled),
        forceCurrentEntry,
    ),
];

const IngestEndpointSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();
    const { id, children } = props;

    const { orgUserState, templateInteractions } = useLoggedInState();
    const { useSignup } = useConfigState();

    const sectionProps: SectionProps<NavIngestEndpoint> = {
        children,
        sectionKey: SectionKey.ingestEndpoint,
        queryResult: useQuery<NavIngestEndpoint>(NavIngestEndpointQuery, {
            variables: { id },
        }),
        initContext: (data) => {
            templateInteractions.setSectionHasAnalytics(analyticsEnabled(data.getIngestEndpoint));
        },
        buildButtonsProps: (data, orgPermissions) => {
            return buildIngestEndpointsButtons(
                data.me.orgs,
                data.getIngestEndpoint.data_manager_account.org,
                data.getIngestEndpoint.data_manager_account.org.tag_manager_account?.id ?? '',
                data.getIngestEndpoint.data_manager_account.id,
                data.getIngestEndpoint.data_manager_account.ingest_endpoints,
                data.getIngestEndpoint,
                analyticsEnabled(data.getIngestEndpoint),
                router,
                orgPermissions,
                useSignup,
            );
        },
        buildMenuItemsProps: (data: NavIngestEndpoint) => {
            return buildIngestEndpointTabsMenu(id, analyticsEnabled(data.getIngestEndpoint));
        },
        extractOrgUserDetails: (data) => data.getIngestEndpoint.data_manager_account.org,
        accountExpireIn: orgUserState?.dataManagerAccount?.trialExpiration ?? undefined,
        accountIsTrial: orgUserState?.dataManagerAccount?.isTrial ?? undefined,
    };

    return <Section<NavIngestEndpoint> {...sectionProps} />;
};

export default IngestEndpointSection;
