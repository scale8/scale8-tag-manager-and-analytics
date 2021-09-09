import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { Box, Container, Grid } from '@material-ui/core';
import DashboardAccountSection from '../../components/organisms/DashboardAccountSection';
import { queryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import { OrgDashboardPageData } from '../../gql/generated/OrgDashboardPageData';
import PageOrgDashboardQuery from '../../gql/queries/PageOrgDashboardQuery';
import { buildSparkQueryOptions } from '../../utils/SparkDataUtils';
import OrgAccountSection from '../../dialogPages/global/orgDashboard/OrgAccountSection';
import { AccountProduct } from '../../gql/generated/globalTypes';
import { useRouter } from 'next/router';
import { toDataManager, toTagManager } from '../../utils/NavigationPaths';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';

const OrgDashboardPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    // Org id
    const id = props.params.id;

    const router = useRouter();

    return queryLoaderAndError<OrgDashboardPageData>(
        true,
        useQuery<OrgDashboardPageData>(PageOrgDashboardQuery, {
            variables: {
                id,
                appQueryOptions: buildSparkQueryOptions(),
                ingestQueryOptions: buildSparkQueryOptions(true),
            },
        }),
        (data: OrgDashboardPageData) => {
            const tmAccount = data.getOrg.tag_manager_account;
            const dmAccount = data.getOrg.data_manager_account;

            const tmId = tmAccount?.id ?? null;
            const dmId = dmAccount?.id ?? null;

            const tmTrialExpired = tmAccount !== null && tmAccount.trial_expired;

            const dmTrialExpired = dmAccount !== null && dmAccount.trial_expired;

            const tagMangerSectionProps = {
                title: 'Tag Manager',
                linkText: 'Go to Tag Manager',
                content: (
                    <OrgAccountSection data={data} accountProduct={AccountProduct.TAG_MANAGER} />
                ),
                ...(tmId === null || tmTrialExpired
                    ? {}
                    : {
                          action: () => {
                              router.push(toTagManager({ id: tmId })).then();
                          },
                      }),
            };

            const dataMangerSectionProps = {
                title: 'Data Manager',
                linkText: 'Go to Data Manager',
                content: (
                    <OrgAccountSection data={data} accountProduct={AccountProduct.DATA_MANAGER} />
                ),
                ...(dmId === null || dmTrialExpired
                    ? {}
                    : {
                          action: () => {
                              router.push(toDataManager({ id: dmId })).then();
                          },
                      }),
            };

            return (
                <>
                    <Container maxWidth="xl">
                        <Box py={4}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                    <DashboardAccountSection {...tagMangerSectionProps} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                    <DashboardAccountSection {...dataMangerSectionProps} />
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>
                </>
            );
        },
    );
};

export default OrgDashboardPage;
