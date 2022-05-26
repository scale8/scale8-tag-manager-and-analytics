import { FC } from 'react';
import { AppErrorContentProps } from '../../types/props/AppErrorContentProps';
import { LazyQueryLoaderAndError } from '../../abstractions/LazyQueryLoaderAndError';
import { useLazyQuery } from '@apollo/client';
import AppErrorsQuery from '../../gql/queries/AppErrorsQuery';
import { AppErrorsQueryData } from '../../gql/generated/AppErrorsQueryData';
import { AppErrorsListContainer } from '../../components/atoms/AppErrorListContainer';
import { NoRecordsMessage } from '../../components/atoms/NoRecordsMessage';
import { AppErrorListTable } from '../../components/molecules/AppErrorListTable';

export type AppError = {
    file: string;
    user_count: number;
    event_count: number;
    column: string;
    errorId: string;
    row: string;
    message: string;
};

const AppErrorsList: FC<AppErrorContentProps> = (props: AppErrorContentProps) => {
    const { appSummaryQueryOptions, appQueryOptions, id, refreshAt } = props;

    const queryOptions = {
        variables: {
            id,
            appQueryOptions: { ...appQueryOptions, limit: 50 },
            appSummaryQueryOptions,
        },
    };

    const extractList = (queryData: AppErrorsQueryData): AppError[] => {
        return queryData.getApp.error_stats.result.map((_) => ({
            errorId: _.error_id,
            message: _.error_message,
            file: _.error_file,
            row: _.error_row,
            column: _.error_column,
            event_count: _.event_count,
            user_count: _.user_count,
        }));
    };

    return LazyQueryLoaderAndError(
        false,
        useLazyQuery(AppErrorsQuery),
        queryOptions,
        (queryData: AppErrorsQueryData) => {
            const list = extractList(queryData);

            const errorResult =
                queryData.getApp.event_request_stats.result.length === 0
                    ? {
                          event_count: 0,
                          user_count: 0,
                      }
                    : queryData.getApp.event_request_stats.result[0];

            const totalErrors = errorResult.event_count;

            if (list.length === 0) {
                return (
                    <AppErrorsListContainer>
                        <NoRecordsMessage />
                    </AppErrorsListContainer>
                );
            }

            return (
                <AppErrorsListContainer>
                    <AppErrorListTable
                        list={list}
                        totalErrors={totalErrors}
                        setFilter={props.setFilter}
                        setFilters={props.setFilters}
                    />
                </AppErrorsListContainer>
            );
        },
        true,
        undefined,
        undefined,
        refreshAt,
    );
};

export { AppErrorsList };
