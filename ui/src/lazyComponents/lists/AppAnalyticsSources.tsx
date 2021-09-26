import { FC } from 'react';
import DashboardListSection from '../../components/organisms/DashboardListSection';
import { useLazyQuery } from '@apollo/client';
import { AppAnalyticsContentProps } from '../../types/props/AppAnalyticsContentProps';
import AppReferrersQuery from '../../gql/queries/AppReferrersQuery';
import { AppReferrersQueryData } from '../../gql/generated/AppReferrersQueryData';
import AppUtmMediumQuery from '../../gql/queries/AppUtmMediumQuery';
import { AppUtmMediumQueryData } from '../../gql/generated/AppUtmMediumQueryData';
import AppUtmSourceQuery from '../../gql/queries/AppUtmSourceQuery';
import { AppUtmSourceQueryData } from '../../gql/generated/AppUtmSourceQueryData';
import AppUtmCampaignQuery from '../../gql/queries/AppUtmCampaignQuery';
import { AppUtmCampaignQueryData } from '../../gql/generated/AppUtmCampaignQueryData';
import { getEventLabel } from '../../utils/AnalyticsUtils';

const AppAnalyticsSources: FC<AppAnalyticsContentProps> = (props: AppAnalyticsContentProps) => {
    const { appQueryOptions, id, referrerTLD, refreshAt } = props;

    const queryOptions = {
        variables: {
            id,
            appQueryOptions,
        },
    };

    return (
        <DashboardListSection
            tabs={[
                {
                    title: 'Referrers',
                    listProps:
                        referrerTLD === undefined
                            ? {
                                  textTitle: 'Referrers',
                                  eventLabel: getEventLabel(appQueryOptions),
                                  extractList: (queryData: AppReferrersQueryData) => {
                                      return queryData.getApp.referrer_tld_stats.result;
                                  },
                                  addFilter: (value) => {
                                      props.setFilter('referrer_tld', value);
                                  },
                                  lazyQuery: useLazyQuery(AppReferrersQuery),
                                  lazyQueryVariables: queryOptions,
                                  useSourceIcon: true,
                                  allowFilterOnSingleEntity: true,
                                  refreshAt,
                                  forErrors: false,
                              }
                            : {
                                  textTitle: `"${referrerTLD}" referrers`,
                                  eventLabel: getEventLabel(appQueryOptions),
                                  extractList: (queryData: AppReferrersQueryData) => {
                                      return queryData.getApp.referrer_stats.result;
                                  },
                                  addFilter: (value) => {
                                      props.setFilter('referrer', value);
                                  },
                                  lazyQuery: useLazyQuery(AppReferrersQuery),
                                  lazyQueryVariables: queryOptions,
                                  refreshAt,
                                  forErrors: false,
                              },
                },
                {
                    title: 'UTM Medium',
                    listProps: {
                        textTitle: 'UTM Medium',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppUtmMediumQueryData) => {
                            return queryData.getApp.utm_medium_stats.result;
                        },
                        addFilter: (value) => {
                            props.setFilter('utm_medium', value);
                        },
                        lazyQuery: useLazyQuery(AppUtmMediumQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: false,
                    },
                },
                {
                    title: 'UTM Source',
                    listProps: {
                        textTitle: 'UTM Source',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppUtmSourceQueryData) => {
                            return queryData.getApp.utm_source_stats.result;
                        },
                        addFilter: (value) => {
                            props.setFilter('utm_source', value);
                        },
                        lazyQuery: useLazyQuery(AppUtmSourceQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: false,
                    },
                },
                {
                    title: 'UTM Campaign',
                    listProps: {
                        textTitle: 'UTM Campaign',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppUtmCampaignQueryData) => {
                            return queryData.getApp.utm_campaign_stats.result;
                        },
                        addFilter: (value) => {
                            props.setFilter('utm_campaign', value);
                        },
                        lazyQuery: useLazyQuery(AppUtmCampaignQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: false,
                    },
                },
            ]}
        />
    );
};

export { AppAnalyticsSources };
