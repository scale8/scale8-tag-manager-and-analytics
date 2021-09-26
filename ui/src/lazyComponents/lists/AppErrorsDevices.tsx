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

const AppErrorsDevices: FC<AppErrorContentProps> = (props: AppErrorContentProps) => {
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
