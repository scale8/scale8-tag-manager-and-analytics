import { FC } from 'react';
import RevisionIcon from '../../components/atoms/Icons/RevisionIcon';
import EnvironmentIcon from '../../components/atoms/Icons/EnvironmentIcon';
import { useQuery } from '@apollo/client';
import { NavIngestEndpoint } from '../../gql/generated/NavIngestEndpoint';
import NavIngestEndpointQuery from '../../gql/queries/NavIngestEndpointQuery';
import {
    buildDataManagerButtonProps,
    buildIngestEndpointButtonProps,
    buildOrgButtonProps,
} from '../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../abstractions/Section';
import { SectionKey } from '../SectionsDetails';
import IngestAnalyticsIcon from '../../components/atoms/Icons/IngestAnalyticsIcon';
import { useLoggedInState } from '../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../types/props/ChildrenAndIdProps';
import { toIngestEndpoint } from '../../utils/NavigationPaths';

const IngestEndpointSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();
    const { id, children } = props;

    const { orgUserState } = useLoggedInState();

    const sectionProps: SectionProps<NavIngestEndpoint> = {
        children,
        sectionKey: SectionKey.ingestEndpoint,
        queryResult: useQuery<NavIngestEndpoint>(NavIngestEndpointQuery, {
            variables: { id },
        }),
        buildButtonsProps: (data) => [
            buildOrgButtonProps(
                router,
                data.me.orgs,
                data.getIngestEndpoint.data_manager_account.org.id,
                data.getIngestEndpoint.data_manager_account.org.name,
            ),
            buildDataManagerButtonProps(
                router,
                data.getIngestEndpoint.data_manager_account.id,
                data.getIngestEndpoint.data_manager_account.org.tag_manager_account?.id ?? '',
            ),
            buildIngestEndpointButtonProps(
                router,
                data.getIngestEndpoint.data_manager_account.ingest_endpoints,
                id,
                data.getIngestEndpoint.name,
                true,
            ),
        ],
        buildMenuItemsProps: () => [
            {
                icon: <IngestAnalyticsIcon />,
                label: 'Analytics',
                link: toIngestEndpoint({ id }, 'analytics'),
            },
            {
                icon: <RevisionIcon />,
                label: 'Revisions',
                link: toIngestEndpoint({ id }, 'revisions'),
            },
            {
                icon: <EnvironmentIcon />,
                label: 'Environments',
                link: toIngestEndpoint({ id }, 'environments'),
            },
        ],
        extractOrgUserDetails: (data) => data.getIngestEndpoint.data_manager_account.org,
        accountExpireIn: orgUserState?.dataManagerAccount?.trialExpiration ?? undefined,
        accountIsTrial: orgUserState?.dataManagerAccount?.isTrial ?? undefined,
    };

    return <Section<NavIngestEndpoint> {...sectionProps} />;
};

export default IngestEndpointSection;
