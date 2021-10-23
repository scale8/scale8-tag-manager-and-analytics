import { FC } from 'react';
import { AppErrorContentProps } from '../types/props/AppErrorContentProps';
import { lazyQueryLoaderAndError } from '../abstractions/LazyQueryLoaderAndError';
import { useLazyQuery } from '@apollo/client';
import AppErrorsQuery from '../gql/queries/AppErrorsQuery';
import { AppErrorsQueryData } from '../gql/generated/AppErrorsQueryData';
import { NoRecordsMessage } from '../components/atoms/NoRecordsMessage';
import { AppErrorDetailsContent } from '../components/organisms/AppErrorDetailsContent';
import { AppErrorDetailsContainer } from '../components/molecules/AppErrorDetails/AppErrorDetailsContainer';

export type AppErrorDetail = {
    file: string;
    user_count: number;
    event_count: number;
    column: string;
    errorId: string;
    row: string;
    error_trace: string;
    message: string;
};

const AppErrorDetails: FC<AppErrorContentProps> = (props: AppErrorContentProps) => {
    const { appSummaryQueryOptions, appQueryOptions, id, refreshAt } = props;

    const queryOptions = {
        variables: {
            id,
            appQueryOptions: { ...appQueryOptions, limit: 50 },
            appSummaryQueryOptions,
        },
    };

    const extractList = (queryData: AppErrorsQueryData) => {
        return queryData.getApp.error_stats.result.map((_) => ({
            errorId: _.error_id,
            message: _.error_message,
            file: _.error_file,
            row: _.error_row,
            column: _.error_column,
            event_count: _.event_count,
            user_count: _.user_count,
            error_trace: _.error_trace,
        }));
    };

    return lazyQueryLoaderAndError(
        false,
        useLazyQuery(AppErrorsQuery),
        queryOptions,
        (queryData: AppErrorsQueryData) => {
            const list: AppErrorDetail[] = extractList(queryData);

            if (list.length === 0) {
                return (
                    <AppErrorDetailsContainer
                        removeFilter={() => {
                            props.setFilter('error_id', undefined);
                        }}
                    >
                        <NoRecordsMessage />
                    </AppErrorDetailsContainer>
                );
            }

            return <AppErrorDetailsContent list={list} {...props} />;
        },
        false,
        undefined,
        undefined,
        refreshAt,
    );
};

export { AppErrorDetails };
