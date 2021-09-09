import { FC } from 'react';
import DashboardListSection from '../../components/organisms/DashboardListSection';
import { useLazyQuery } from '@apollo/client';
import { AppAnalyticsContentProps } from '../../types/props/AppAnalyticsContentProps';
import AppPagesQuery from '../../gql/queries/AppPagesQuery';
import AppEntryPagesQuery from '../../gql/queries/AppEntryPagesQuery';
import AppExitPagesQuery from '../../gql/queries/AppExitPagesQuery';
import { AppPagesQueryData } from '../../gql/generated/AppPagesQueryData';
import { AppEntryPagesQueryData } from '../../gql/generated/AppEntryPagesQueryData';
import { AppExitPagesQueryData } from '../../gql/generated/AppExitPagesQueryData';
import { getEventLabel } from '../../utils/AnalyticsUtils';

const AppAnalyticsPages: FC<AppAnalyticsContentProps> = (props: AppAnalyticsContentProps) => {
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
                    title: 'Top Pages',
                    listProps: {
                        textTitle: 'Page',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppPagesQueryData) => {
                            return queryData.getApp.page_stats.result;
                        },
                        addFilter: (value) => {
                            props.setFilter('page', value);
                        },
                        lazyQuery: useLazyQuery(AppPagesQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                    },
                },
                {
                    title: 'Entry Pages',
                    listProps: {
                        textTitle: 'Page',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppEntryPagesQueryData) => {
                            return queryData.getApp.entry_page_stats.result;
                        },
                        addFilter: (value) => {
                            props.setFilter('page', value);
                        },
                        lazyQuery: useLazyQuery(AppEntryPagesQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                    },
                },
                {
                    title: 'Exit Pages',
                    listProps: {
                        textTitle: 'Page',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppExitPagesQueryData) => {
                            return queryData.getApp.exit_page_stats.result;
                        },
                        addFilter: (value) => {
                            props.setFilter('page', value);
                        },
                        lazyQuery: useLazyQuery(AppExitPagesQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                    },
                },
            ]}
        />
    );
};

export { AppAnalyticsPages };
