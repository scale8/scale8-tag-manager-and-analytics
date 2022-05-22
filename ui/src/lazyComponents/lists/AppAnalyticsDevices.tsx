import { FC } from 'react';
import DashboardListSection from '../../components/organisms/DashboardListSection';
import { useLazyQuery } from '@apollo/client';
import { AppAnalyticsContentProps } from '../../types/props/AppAnalyticsContentProps';
import AppDevicesQuery from '../../gql/queries/AppDevicesQuery';
import { AppDevicesQueryData } from '../../gql/generated/AppDevicesQueryData';
import AppBrowsersQuery from '../../gql/queries/AppBrowsersQuery';
import AppOperatingSystemsQuery from '../../gql/queries/AppOperatingSystemsQuery';
import { AppBrowsersQueryData } from '../../gql/generated/AppBrowsersQueryData';
import { AppOperatingSystemsQueryData } from '../../gql/generated/AppOperatingSystemsQueryData';
import { getEventLabel } from '../../utils/AnalyticsUtils';
import { AppScreenSizesQueryData } from '../../gql/generated/AppScreenSizesQueryData';
import AppScreenSizesQuery from '../../gql/queries/AppScreenSizesQuery';

const AppAnalyticsDevices: FC<AppAnalyticsContentProps> = (props: AppAnalyticsContentProps) => {
    const { appQueryOptions, id, refreshAt } = props;

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
                    title: 'Devices',
                    listProps: {
                        textTitle: 'Device',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppDevicesQueryData) => {
                            return queryData.getApp.device_stats.result;
                        },
                        addFilter: (value) => {
                            props.setFilter('mobile', value === 'Mobile');
                        },
                        lazyQuery: useLazyQuery(AppDevicesQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: false,
                    },
                },
                {
                    title: 'Screen Sizes',
                    listProps: {
                        textTitle: 'Screen Size',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppScreenSizesQueryData) => {
                            return queryData.getApp.screen_size_stats.result;
                        },
                        addFilter: (value) => {
                            props.setFilter('screen_size', value);
                        },
                        lazyQuery: useLazyQuery(AppScreenSizesQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: false,
                    },
                },
                {
                    title: 'Browsers',
                    listProps: {
                        textTitle: 'Browser',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppBrowsersQueryData) => {
                            return queryData.getApp.browser_stats.result;
                        },
                        addFilter: (value) => {
                            props.setFilter('browser', value);
                        },
                        lazyQuery: useLazyQuery(AppBrowsersQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: false,
                    },
                },
                {
                    title: 'Operating Systems',
                    listProps: {
                        textTitle: 'Operating System',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppOperatingSystemsQueryData) => {
                            return queryData.getApp.operating_system_stats.result;
                        },
                        addFilter: (value) => {
                            props.setFilter('os', value);
                        },
                        lazyQuery: useLazyQuery(AppOperatingSystemsQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: false,
                    },
                },
            ]}
        />
    );
};

export { AppAnalyticsDevices };
