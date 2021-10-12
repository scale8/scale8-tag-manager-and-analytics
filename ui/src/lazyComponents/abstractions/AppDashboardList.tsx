import { FC } from 'react';
import { Box } from '@material-ui/core';
import { QueryTuple } from '@apollo/client/react/types/types';
import { CircularProgressWithLabel } from '../../components/atoms/CircularProgressWithLabel';
import { makeStyles } from '@material-ui/core/styles';
import { OperationVariables } from '@apollo/client/core';
import { lazyQueryLoaderAndError } from '../../abstractions/LazyQueryLoaderAndError';
import { AppGroupingCount, AppGroupingNameVersionCount } from '../../utils/AnalyticsUtils';
import { UTCTimestamp } from '../../utils/DateTimeUtils';

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
    extractList: (queryData: any) => (AppGroupingCount | AppGroupingNameVersionCount)[];
    addFilter?: (value: string) => void;
    addVersionFilter?: (name: string, version: string) => void;
    useSourceIcon?: boolean;
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
                return (
                    <Box width="100%">
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Box color="#777777">No records to display</Box>
                        </Box>
                    </Box>
                );
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
                        const hasVersion = _.hasOwnProperty('version');

                        const name = hasVersion
                            ? (_ as AppGroupingNameVersionCount).name
                            : (_ as AppGroupingCount).key;
                        const version = hasVersion
                            ? (_ as AppGroupingNameVersionCount).version
                            : '';

                        const key = hasVersion ? name : `${name}-${version}`;

                        const addFilter = () => {
                            if (props.addFilter !== undefined) {
                                props.addFilter(name);
                            }
                        };

                        const addVersionFilter = () => {
                            if (props.addVersionFilter !== undefined) {
                                props.addVersionFilter(name, version);
                            }
                        };

                        return (
                            <Box key={key} display="flex" alignItems="center">
                                {!!props.useSourceIcon && (
                                    <img
                                        src={`https://icons.duckduckgo.com/ip3/${name}.ico`}
                                        referrerPolicy="no-referrer"
                                        alt={name}
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
                                    >
                                        <span
                                            className={
                                                props.addFilter !== undefined
                                                    ? classes.filterLink
                                                    : undefined
                                            }
                                            onClick={
                                                props.addFilter !== undefined
                                                    ? addFilter
                                                    : undefined
                                            }
                                        >
                                            {name}
                                        </span>
                                        {hasVersion && (
                                            <>
                                                {' '}
                                                (
                                                <span
                                                    className={
                                                        props.addVersionFilter !== undefined
                                                            ? classes.filterLink
                                                            : undefined
                                                    }
                                                    onClick={
                                                        props.addVersionFilter !== undefined
                                                            ? addVersionFilter
                                                            : undefined
                                                    }
                                                >
                                                    {version}
                                                </span>
                                                )
                                            </>
                                        )}
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
