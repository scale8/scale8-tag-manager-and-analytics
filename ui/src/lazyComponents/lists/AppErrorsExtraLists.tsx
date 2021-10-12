import { FC } from 'react';
import DashboardListSection from '../../components/organisms/DashboardListSection';
import { useLazyQuery } from '@apollo/client';
import AppCountriesQuery from '../../gql/queries/AppCountriesQuery';
import { AppCountriesQueryData } from '../../gql/generated/AppCountriesQueryData';
import { getCountryCode, getCountryLabel } from '../../utils/CountryUtils';
import { getEventLabel } from '../../utils/AnalyticsUtils';
import { AppErrorContentProps } from '../../types/props/AppErrorContentProps';
import { AppPagesQueryData } from '../../gql/generated/AppPagesQueryData';
import AppPagesQuery from '../../gql/queries/AppPagesQuery';

const AppErrorsExtraLists: FC<AppErrorContentProps> = (props: AppErrorContentProps) => {
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
                    title: 'Pages',
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
                        forErrors: true,
                    },
                },
                {
                    title: 'Countries',
                    listProps: {
                        textTitle: 'Country',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppCountriesQueryData) => {
                            return queryData.getApp.country_stats.result.map((_) => ({
                                key: getCountryLabel(_.key),
                                event_count: _.event_count,
                                user_count: _.user_count,
                            }));
                        },
                        addFilter: (value) => {
                            props.setFilter('country', getCountryCode(value));
                        },
                        lazyQuery: useLazyQuery(AppCountriesQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: true,
                    },
                },
            ]}
        />
    );
};

export { AppErrorsExtraLists };
