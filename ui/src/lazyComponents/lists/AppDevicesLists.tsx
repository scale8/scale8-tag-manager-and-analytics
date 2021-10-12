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
import AppDeviceCategoriesQuery from '../../gql/queries/AppDeviceCategoriesQuery';
import { AppDeviceCategoriesQueryData } from '../../gql/generated/AppDeviceCategoriesQueryData';
import { AppErrorContentProps } from '../../types/props/AppErrorContentProps';

type AppDevicesListsProps = (AppAnalyticsContentProps | AppErrorContentProps) & {
    forErrors: boolean;
};

export const AppDevicesLists: FC<AppDevicesListsProps> = (props: AppDevicesListsProps) => {
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
                            props.setFilter('device_name', value);
                        },
                        lazyQuery: useLazyQuery(AppDevicesQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: props.forErrors,
                    },
                },
                {
                    title: 'Device Categories',
                    listProps: {
                        textTitle: 'Device category',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppDeviceCategoriesQueryData) => {
                            return queryData.getApp.device_category_stats.result;
                        },
                        addFilter: (value) => {
                            props.setFilter('mobile', value === 'Mobile');
                        },
                        lazyQuery: useLazyQuery(AppDeviceCategoriesQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: props.forErrors,
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
                        addVersionFilter: (name, version) => {
                            props.setFilters({
                                ...props.filters,
                                browser: name,
                                browser_version: version,
                            });
                        },
                        lazyQuery: useLazyQuery(AppBrowsersQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: props.forErrors,
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
                        addVersionFilter: (name, version) => {
                            props.setFilters({
                                ...props.filters,
                                os: name,
                                os_version: version,
                            });
                        },
                        lazyQuery: useLazyQuery(AppOperatingSystemsQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: props.forErrors,
                    },
                },
            ]}
        />
    );
};
