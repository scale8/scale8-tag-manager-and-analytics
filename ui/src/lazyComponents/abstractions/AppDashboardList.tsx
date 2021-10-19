import { FC } from 'react';
import { Box } from '@mui/material';
import { QueryTuple } from '@apollo/client/react/types/types';
import { CircularProgressWithLabel } from '../../components/atoms/CircularProgressWithLabel';
import makeStyles from '@mui/styles/makeStyles';
import { OperationVariables } from '@apollo/client/core';
import { lazyQueryLoaderAndError } from '../../abstractions/LazyQueryLoaderAndError';
import { AppGroupingCount } from '../../utils/AnalyticsUtils';
import { UTCTimestamp } from '../../utils/DateTimeUtils';
import { NoRecordsMessage } from '../../components/atoms/NoRecordsMessage';

export type GroupingCount = {
    key: string;
    count: number;
};

export type DashboardListProps = {
    forErrors: boolean;
    textTitle: string;
    lazyQuery: QueryTuple<any, any>;
    eventLabel: string;
    lazyQueryVariables: OperationVariables;
    extractList: (queryData: any) => AppGroupingCount[];
    addFilter?: (value: string) => void;
    useSourceIcon?: boolean;
    allowFilterOnSingleEntity?: boolean;
    refreshAt: UTCTimestamp | undefined;
};

const useStyles = makeStyles(() => ({
    filterLink: {
        color: 'inherit',
        cursor: 'pointer',
        lineHeight: '1.5em',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
}));

const AppDashboardList: FC<DashboardListProps> = (props: DashboardListProps) => {
    const classes = useStyles();

    return lazyQueryLoaderAndError(
        false,
        props.lazyQuery,
        props.lazyQueryVariables,
        (queryData: GroupingCount) => {
            const list = props.extractList(queryData);

            const total = list.reduce((t, v) => {
                return t + v.event_count;
            }, 0);

            if (total === 0) {
                return <NoRecordsMessage />;
            }

            return (
                <Box width="100%">
                    <Box display="flex" alignItems="center" mb={1}>
                        <Box flexGrow={1} fontWeight="bold">
                            {props.textTitle}
                        </Box>
                        <Box fontWeight="bold" width={100} mx={1} textAlign="right">
                            {props.forErrors ? 'Users w/errors' : 'Unique Visitors'}
                        </Box>
                        <Box fontWeight="bold" width={140} textAlign="right">
                            {props.forErrors ? 'Total errors' : `${props.eventLabel} Events`}
                        </Box>
                    </Box>

                    {list.map((_) => {
                        const hasFilterLink =
                            props.addFilter !== undefined &&
                            (!!props.allowFilterOnSingleEntity || list.length > 1);

                        const addFilter = () => {
                            if (props.addFilter !== undefined) {
                                props.addFilter(_.key);
                            }
                        };

                        return (
                            <Box key={_.key} display="flex" alignItems="center">
                                {!!props.useSourceIcon && (
                                    <img
                                        src={`https://icons.duckduckgo.com/ip3/${_.key}.ico`}
                                        referrerPolicy="no-referrer"
                                        alt={_.key}
                                        style={{
                                            marginTop: '2px',
                                            width: '16px',
                                            height: '16px',
                                            display: 'block',
                                            marginRight: '10px',
                                        }}
                                    />
                                )}
                                <Box flexGrow={1} position="relative" height={20}>
                                    <Box
                                        whiteSpace="nowrap"
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        position="absolute"
                                        width="100%"
                                        className={hasFilterLink ? classes.filterLink : undefined}
                                        onClick={hasFilterLink ? addFilter : undefined}
                                    >
                                        {_.key}
                                    </Box>
                                </Box>
                                <Box width={100} mx={1} flexShrink={0} textAlign="right">
                                    {_.user_count}
                                </Box>
                                <Box
                                    width={140}
                                    display="flex"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    flexShrink={0}
                                >
                                    <Box>{_.event_count}</Box>
                                    <Box fontSize="8px" height={35} width={40} pt="3px" pl="10px">
                                        <CircularProgressWithLabel
                                            size={30}
                                            value={(_.event_count / total) * 100}
                                            forErrors={props.forErrors}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            );
        },
        true,
        undefined,
        undefined,
        props.refreshAt,
    );
};

export { AppDashboardList };
