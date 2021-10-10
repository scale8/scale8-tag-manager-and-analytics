import { FC, useEffect, useState } from 'react';
import { AppErrorContentProps } from '../types/props/AppErrorContentProps';
import { Box, Card, Divider, Paper } from '@material-ui/core';
import { lazyQueryLoaderAndError } from '../abstractions/LazyQueryLoaderAndError';
import { useLazyQuery } from '@apollo/client';
import AppErrorsQuery from '../gql/queries/AppErrorsQuery';
import { AppErrorsQueryData } from '../gql/generated/AppErrorsQueryData';
import { ChildrenOnlyProps } from '../types/props/ChildrenOnlyProps';
import LazyShiki from '../components/atoms/LibraryLoaders/LazyShiki';
import { makeStyles } from '@material-ui/core/styles';
import { getApiUrl } from '../utils/ConfigUtils';

const useStyles = makeStyles((theme) => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: '4px',
    },
    filterLink: {
        color: 'inherit',
        cursor: 'pointer',
        lineHeight: '1.5em',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    detailBlock: {
        paddingBottom: theme.spacing(2),
        whiteSpace: 'break-spaces',
        wordBreak: 'break-all',
    },
}));

const CodeBox: FC<{ fileUrl: string; row: number; col: number }> = ({ fileUrl, row, col }) => {
    const [code, setCode] = useState<string | null>(null);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `${getApiUrl()}/api/fetch-as-text?url=${encodeURIComponent(fileUrl)}`,
                    {
                        method: 'GET',
                        redirect: 'follow',
                    },
                );
                const data = await response.json();
                setCode(data.contents);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [fileUrl]);

    return (
        <Box zIndex={1} height={250}>
            <Paper
                elevation={5}
                style={{
                    height: 250,
                    backgroundColor: '#2e3440',
                    zIndex: 2,
                    borderRadius: 0,
                }}
            >
                <Box color="white" pl={1} pt={1}>
                    Loading...
                </Box>
                {code !== null && (
                    <Box marginTop="-28px">
                        <LazyShiki language="js" code={code} errorPosition={{ row, col }} />
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

const AppErrorDetailsContainer: FC<ChildrenOnlyProps> = (props: ChildrenOnlyProps) => {
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
                ERROR DETAILS
            </Box>
            <Divider />

            <Box p={3} pb={1} height={400} overflow="auto">
                {props.children}
            </Box>
        </Card>
    );
};

const DetailBlock: FC<ChildrenOnlyProps> = (props: ChildrenOnlyProps) => {
    const classes = useStyles();
    return <div className={classes.detailBlock}>{props.children}</div>;
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
                    <AppErrorDetailsContainer>
                        <Box width="100%">
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Box color="#777777">No records to display</Box>
                            </Box>
                        </Box>
                    </AppErrorDetailsContainer>
                );
            }

            return (
                <AppErrorDetailsContainer>
                    <Box width="100%">
                        <DetailBlock>
                            <b>Message:</b> "<i>{list[0].message}</i>"
                        </DetailBlock>
                        <DetailBlock>
                            <b>File:</b> "<i>{list[0].file}</i>"
                        </DetailBlock>
                        <DetailBlock>
                            <b>
                                Code (Error at Line: {list[0].row} Column: {list[0].column}):
                            </b>
                        </DetailBlock>
                        <CodeBox
                            fileUrl={list[0].file}
                            row={parseInt(list[0].row)}
                            col={parseInt(list[0].column)}
                        />
                    </Box>
                </AppErrorDetailsContainer>
            );
        },
        false,
        undefined,
        undefined,
        refreshAt,
    );
};

export { AppErrorDetails };
