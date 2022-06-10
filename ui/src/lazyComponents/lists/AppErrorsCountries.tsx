import { FC } from 'react';
import DashboardListSection from '../../components/organisms/DashboardListSection';
import { useLazyQuery } from '@apollo/client';
import AppCountriesQuery from '../../gql/queries/AppCountriesQuery';
import { AppCountriesQueryData } from '../../gql/generated/AppCountriesQueryData';
import { getCountryCode, getCountryLabel } from '../../utils/CountryUtils';
import { getEventLabel } from '../../utils/AnalyticsUtils';
import { AppErrorContentProps } from '../../types/props/AppErrorContentProps';
import AppRegionsQuery from '../../gql/queries/AppRegionsQuery';
import { AppRegionsQueryData } from '../../gql/generated/AppRegionsQueryData';
import AppCitiesQuery from '../../gql/queries/AppCitiesQuery';
import { AppCitiesQueryData } from '../../gql/generated/AppCitiesQueryData';
import { getAnalyticsPollingFrequency } from '../../utils/ConfigUtils';

const AppErrorsCountries: FC<AppErrorContentProps> = (props: AppErrorContentProps) => {
    const { appQueryOptions, id, refreshAt } = props;

    const queryOptions = {
        variables: {
            id,
            appQueryOptions,
        },
        pollInterval: getAnalyticsPollingFrequency(),
    };

    return (
        <DashboardListSection
            tabs={[
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
                {
                    title: 'Regions',
                    listProps: {
                        textTitle: 'Region',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppRegionsQueryData) => {
                            return queryData.getApp.region_stats.result;
                        },
                        addFilter: (value) => {
                            props.setFilter('region', value);
                        },
                        lazyQuery: useLazyQuery(AppRegionsQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: true,
                    },
                },
                {
                    title: 'Cities',
                    listProps: {
                        textTitle: 'City',
                        eventLabel: getEventLabel(appQueryOptions),
                        extractList: (queryData: AppCitiesQueryData) => {
                            return queryData.getApp.city_stats.result;
                        },
                        addFilter: (value) => {
                            props.setFilter('city', value);
                        },
                        lazyQuery: useLazyQuery(AppCitiesQuery),
                        lazyQueryVariables: queryOptions,
                        refreshAt,
                        forErrors: true,
                    },
                },
            ]}
        />
    );
};

export { AppErrorsCountries };
