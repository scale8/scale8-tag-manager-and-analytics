import { FC } from 'react';
import { AppErrorContentProps } from '../../types/props/AppErrorContentProps';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, Divider, Tooltip } from '@material-ui/core';
import { lazyQueryLoaderAndError } from '../../abstractions/LazyQueryLoaderAndError';
import { useLazyQuery } from '@apollo/client';
import AppErrorsQuery from '../../gql/queries/AppErrorsQuery';
import { AppErrorsQueryData } from '../../gql/generated/AppErrorsQueryData';
import { ChildrenOnlyProps } from '../../types/props/ChildrenOnlyProps';

const useStyles = makeStyles(() => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: '4px',
    },
    tab: {
        minWidth: '50px',
    },
    hideIndicator: {
        display: 'none',
    },
    filterLink: {
        color: 'inherit',
        cursor: 'pointer',
        lineHeight: '1.5em',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
}));

const AppErrorsListContainer: FC<ChildrenOnlyProps> = (props: ChildrenOnlyProps) => {
    const classes = useStyles();

    return (
        <Card className={classes.card} elevation={0}>
            <Box
                bgcolor="#f5f5f5;"
                width="100%"
                height="48px"
                textAlign="center"
                lineHeight="48px"
                fontSize="12px"
            >
                ERRORS
            </Box>
            <Divider />

            <Box p={3} pb={1} height={400} overflow="auto">
                {props.children}
            </Box>
        </Card>
    );
};

const AppErrorsList: FC<AppErrorContentProps> = (props: AppErrorContentProps) => {
    const classes = useStyles();
    const { appQueryOptions, id, refreshAt } = props;

    const queryOptions = {
        variables: {
            id,
            appQueryOptions,
        },
    };

    const extractList = (queryData: AppErrorsQueryData) => {
        return queryData.getApp.error_stats.result.map((_) => ({
            message: _.error_message,
            firstPage: _.first_page_url,
            file: _.error_file,
            row: _.error_row,
            column: _.error_column,
            event_count: _.event_count,
            user_count: _.user_count,
        }));
    };

    return lazyQueryLoaderAndError(
        false,
        useLazyQuery(AppErrorsQuery),
        queryOptions,
        (queryData: AppErrorsQueryData) => {
            const list = extractList(queryData);

            if (list.length === 0) {
                return (
                    <AppErrorsListContainer>
                        <Box width="100%">
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Box color="#777777">No records to display</Box>
                            </Box>
                        </Box>
                    </AppErrorsListContainer>
                );
            }

            return (
                <AppErrorsListContainer>
                    <Box width="100%">
                        <Box display="flex" alignItems="center" mb={1}>
                            <Box flexGrow={1} flexBasis={0} fontWeight="bold">
                                Message
                            </Box>
                            <Box fontWeight="bold" flexGrow={1} flexBasis={0} mx={1}>
                                First page with error
                            </Box>
                            <Box fontWeight="bold" flexGrow={1} flexBasis={0}>
                                File
                            </Box>
                            <Box fontWeight="bold" width={100} ml={1}>
                                Line/Column
                            </Box>
                            <Box fontWeight="bold" width={100} mx={1} textAlign="right">
                                Users affected
                            </Box>
                            <Box fontWeight="bold" width={140} textAlign="right">
                                Total Occurrences
                            </Box>
                        </Box>
                    </Box>
                    {list.map((_, index) => {
                        const addMessageFilter = () => {
                            props.setFilter('error_message', _.message);
                        };

                        const addPageFilter = () => {
                            props.setFilter('page', _.firstPage);
                        };

                        const addFileFilter = () => {
                            props.setFilter('error_file', _.file);
                        };

                        return (
                            <Box key={index} display="flex" alignItems="center">
                                <Box flexGrow={1} flexBasis={0} position="relative" height={20}>
                                    <Tooltip title={_.message} placement="bottom-start">
                                        <Box
                                            whiteSpace="nowrap"
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                            position="absolute"
                                            width="100%"
                                            className={classes.filterLink}
                                            onClick={addMessageFilter}
                                        >
                                            {_.message}
                                        </Box>
                                    </Tooltip>
                                </Box>
                                <Box
                                    flexGrow={1}
                                    flexBasis={0}
                                    mx={1}
                                    position="relative"
                                    height={20}
                                >
                                    <Tooltip title={_.firstPage} placement="bottom-start">
                                        <Box
                                            whiteSpace="nowrap"
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                            position="absolute"
                                            width="100%"
                                            className={classes.filterLink}
                                            onClick={addPageFilter}
                                        >
                                            {_.firstPage}
                                        </Box>
                                    </Tooltip>
                                </Box>
                                <Box flexGrow={1} flexBasis={0} position="relative" height={20}>
                                    <Tooltip title={_.file} placement="bottom-start">
                                        <Box
                                            whiteSpace="nowrap"
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                            position="absolute"
                                            width="100%"
                                            className={classes.filterLink}
                                            onClick={addFileFilter}
                                        >
                                            {_.file}
                                        </Box>
                                    </Tooltip>
                                </Box>
                                <Box width={100} ml={1} flexShrink={0}>
                                    <b>L</b> {_.row} <b>C</b> {_.column}
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
                                </Box>
                            </Box>
                        );
                    })}
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
