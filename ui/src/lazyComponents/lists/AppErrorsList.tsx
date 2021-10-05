import { FC } from 'react';
import { AppErrorContentProps } from '../../types/props/AppErrorContentProps';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    Card,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
} from '@material-ui/core';
import { lazyQueryLoaderAndError } from '../../abstractions/LazyQueryLoaderAndError';
import { useLazyQuery } from '@apollo/client';
import AppErrorsQuery from '../../gql/queries/AppErrorsQuery';
import { AppErrorsQueryData } from '../../gql/generated/AppErrorsQueryData';
import { ChildrenOnlyProps } from '../../types/props/ChildrenOnlyProps';
import { AnchorLinkIcon } from '../../components/atoms/AnchorLinkIcon';
import { CircularProgressWithLabel } from '../../components/atoms/CircularProgressWithLabel';

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
                        <Table style={{ width: '100%' }} aria-label="errors">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Message</TableCell>
                                    <TableCell>First page with error</TableCell>
                                    <TableCell>File</TableCell>
                                    <TableCell width={150}>Line/Column</TableCell>
                                    <TableCell align="right" width={150}>
                                        Users affected
                                    </TableCell>
                                    <TableCell align="right" width={150}>
                                        Total Occurrences
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
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
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Tooltip title={_.message} placement="bottom-start">
                                                    <Box
                                                        style={{ width: 'calc(33vw - 300px)' }}
                                                        whiteSpace="nowrap"
                                                        overflow="hidden"
                                                        textOverflow="ellipsis"
                                                        className={classes.filterLink}
                                                        onClick={addMessageFilter}
                                                    >
                                                        {_.message}
                                                    </Box>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip
                                                    title={_.firstPage}
                                                    placement="bottom-start"
                                                >
                                                    <Box
                                                        style={{ width: 'calc(33vw - 300px)' }}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="left"
                                                    >
                                                        <Box marginRight={1}>
                                                            <AnchorLinkIcon href={_.firstPage} />
                                                        </Box>
                                                        <Box
                                                            whiteSpace="nowrap"
                                                            overflow="hidden"
                                                            textOverflow="ellipsis"
                                                            className={classes.filterLink}
                                                            onClick={addPageFilter}
                                                        >
                                                            {_.firstPage}
                                                        </Box>
                                                    </Box>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={_.file} placement="bottom-start">
                                                    <Box
                                                        style={{ width: 'calc(33vw - 300px)' }}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="left"
                                                    >
                                                        <Box marginRight={1}>
                                                            <AnchorLinkIcon href={_.file} />
                                                        </Box>

                                                        <Box
                                                            whiteSpace="nowrap"
                                                            overflow="hidden"
                                                            textOverflow="ellipsis"
                                                            className={classes.filterLink}
                                                            onClick={addFileFilter}
                                                        >
                                                            {_.file}
                                                        </Box>
                                                    </Box>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell width={150}>
                                                <b>L</b> {_.row} <b>C</b> {_.column}
                                            </TableCell>
                                            <TableCell align="right" width={150}>
                                                {_.user_count}
                                            </TableCell>
                                            <TableCell align="right" width={150}>
                                                <Box
                                                    width={150}
                                                    display="flex"
                                                    justifyContent="flex-end"
                                                    alignItems="center"
                                                >
                                                    <Box>{_.event_count}</Box>
                                                    <Box
                                                        fontSize="8px"
                                                        height={35}
                                                        width={40}
                                                        pt="3px"
                                                        pl="10px"
                                                    >
                                                        <CircularProgressWithLabel
                                                            size={30}
                                                            value={
                                                                (_.event_count / totalErrors) * 100
                                                            }
                                                            forErrors
                                                        />
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
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
