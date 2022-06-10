import { FC } from 'react';
import DashboardListSection from '../../components/organisms/DashboardListSection';
import { useLazyQuery } from '@apollo/client';
import AppDevicesQuery from '../../gql/queries/AppDevicesQuery';
import { AppDevicesQueryData } from '../../gql/generated/AppDevicesQueryData';
import AppBrowsersQuery from '../../gql/queries/AppBrowsersQuery';
import AppOperatingSystemsQuery from '../../gql/queries/AppOperatingSystemsQuery';
import { AppBrowsersQueryData } from '../../gql/generated/AppBrowsersQueryData';
import { AppOperatingSystemsQueryData } from '../../gql/generated/AppOperatingSystemsQueryData';
import { getEventLabel } from '../../utils/AnalyticsUtils';
import { AppErrorContentProps } from '../../types/props/AppErrorContentProps';
import { AppScreenSizesQueryData } from '../../gql/generated/AppScreenSizesQueryData';
import AppScreenSizesQuery from '../../gql/queries/AppScreenSizesQuery';
import { AppBrowserVersionsQueryData } from '../../gql/generated/AppBrowserVersionsQueryData';
import AppBrowserVersionsQuery from '../../gql/queries/AppBrowserVersionsQuery';
import { getAnalyticsPollingFrequencyMs } from '../../utils/ConfigUtils';

const AppErrorsDevices: FC<AppErrorContentProps> = (props: AppErrorContentProps) => {
    const { appQueryOptions, id, refreshAt } = props;

    const queryOptions = {
        variables: {
            id,
            appQueryOptions,
        },
        pollInterval: getAnalyticsPollingFrequencyMs(),
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
                        forErrors: true,
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
                        forErrors: true,
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
                        forErrors: true,
                    },
                },
                {
                    title: 'Browser Versions',
                    listProps: {
                        textTitle: 'Browser Version',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppBrowserVersionsQueryData) => {
                            return queryData.getApp.browser_version_stats.result;
                        },
                        compositeValueToLabel: (
                            value: {
                                field: string;
                                value: string;
                            }[],
                        ) => {
                            return value.map((_) => _.value).join(' - ');
                        },
                        addCompositeFilter: (value) => {
                            const browserValue = value.find((_) => _.field === 'browser_name');
                            const browserVersionValue = value.find(
                                (_) => _.field === 'browser_version',
                            );
                            if (browserValue && browserVersionValue) {
                                props.setFilters((filters) => ({
                                    ...filters,
                                    browser: browserValue.value,
                                    browser_version: browserVersionValue.value,
                                }));
                            }
                        },
                        lazyQuery: useLazyQuery(AppBrowserVersionsQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: true,
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
                        forErrors: true,
                    },
                },
            ]}
        />
    );
};

export { AppErrorsDevices };
