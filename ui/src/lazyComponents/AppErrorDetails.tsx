import { FC, useEffect, useState } from 'react';
import { AppErrorContentProps } from '../types/props/AppErrorContentProps';
import { Box, Card, Divider, Paper } from '@mui/material';
import { lazyQueryLoaderAndError } from '../abstractions/LazyQueryLoaderAndError';
import { useLazyQuery } from '@apollo/client';
import AppErrorsQuery from '../gql/queries/AppErrorsQuery';
import { AppErrorsQueryData } from '../gql/generated/AppErrorsQueryData';
import { ChildrenOnlyProps } from '../types/props/ChildrenOnlyProps';
import LazyShiki from '../components/atoms/LibraryLoaders/LazyShiki';
import makeStyles from '@mui/styles/makeStyles';
import { getApiUrl } from '../utils/ConfigUtils';
import { unMinifyCodeWithErrorCoordinatesMapping } from '../utils/CodeUtils';
import { AnchorLinkIcon } from '../components/atoms/AnchorLinkIcon';
import Alert from '@mui/material/Alert';

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
    detailTitle: {
        marginBottom: theme.spacing(1),
        whiteSpace: 'break-spaces',
        wordBreak: 'break-all',
    },
    detailBlock: {
        flex: 1,
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        whiteSpace: 'break-spaces',
        wordBreak: 'break-all',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: '4px',
        '&:first-child': {
            marginRight: theme.spacing(1),
        },
        '&:last-child': {
            marginLeft: theme.spacing(1),
        },
    },
    detailBlockTitle: {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '14px',
        position: 'absolute',
        marginLeft: '-2px',
        marginTop: '-27px',
        padding: '0px 3px',
        backgroundColor: '#ffffff',
    },
    '@keyframes blink': {
        '0%': {
            opacity: 0,
        },
        '50%': {
            opacity: 1,
        },
        '100%': {
            opacity: 0,
        },
    },
    blinkingDot: {
        animation: `$blink 2s infinite`,
    },

    stackPre: {
        position: 'relative',
        display: 'block',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: '#2e3440ff',
        margin: 0,
        color: 'rgb(216, 222, 233)',
        padding: theme.spacing(1),
        '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',
        },
        fontSize: 15,
        whiteSpace: 'break-spaces',
        wordBreak: 'break-all',
    },
}));

const DetailTitle: FC<ChildrenOnlyProps> = (props: ChildrenOnlyProps) => {
    const classes = useStyles();
    return <div className={classes.detailTitle}>{props.children}</div>;
};

const DetailBlock: FC<ChildrenOnlyProps & { title: string }> = ({ children, title }) => {
    const classes = useStyles();
    return (
        <div className={classes.detailBlock}>
            <Box position="relative">
                <div className={classes.detailBlockTitle}>{title}</div>
            </Box>
            {children}
        </div>
    );
};

const TraceBox: FC<{ trace: string }> = ({ trace }) => {
    const classes = useStyles();
    return (
        <>
            <DetailTitle>
                <b>Stack trace:</b>
            </DetailTitle>
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
                    <pre className={classes.stackPre}>{trace}</pre>
                </Paper>
            </Box>
        </>
    );
};

const CodeBox: FC<{ fileUrl: string; errorRow: number; errorCol: number }> = ({
    fileUrl,
    errorRow,
    errorCol,
}) => {
    const classes = useStyles();

    const [code, setCode] = useState<string | null>(null);
    const [row, setRow] = useState(0);
    const [col, setCol] = useState(0);
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
                const [unminifiedCode, unminifiedRow, unminifiedCol] =
                    unMinifyCodeWithErrorCoordinatesMapping(data.contents, errorRow, errorCol);

                setCode(unminifiedCode);
                setRow(unminifiedRow);
                setCol(unminifiedCol);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [fileUrl]);

    return (
        <>
            <DetailTitle>
                {code === null || (errorRow === row && errorCol === col) ? (
                    <b>
                        Code (Error at Line: {errorRow} Column: {errorCol}):
                    </b>
                ) : (
                    <b>
                        Code (Error at Line: {errorRow} Column: {errorCol}, un-minified at Line:{' '}
                        {row} Column: {col}):
                    </b>
                )}
            </DetailTitle>
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
                    <Box color="white" pl={1} pt={1} height={30} overflow="hidden">
                        Loading...<span className={classes.blinkingDot}>.</span>
                    </Box>
                    {code !== null && (
                        <Box marginTop="-30px" height="100%">
                            <LazyShiki language="js" code={code} errorPosition={{ row, col }} />
                        </Box>
                    )}
                </Paper>
            </Box>
        </>
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

            <Box p={3} pb={1}>
                {props.children}
            </Box>
        </Card>
    );
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
                        <Box display="flex">
                            <DetailBlock title="Message">
                                <Box display="flex" alignItems="center">
                                    <Box marginTop="2px">{list[0].message}</Box>
                                </Box>
                            </DetailBlock>
                            <DetailBlock title="File">
                                <Box display="flex" alignItems="center">
                                    <Box marginRight={1} marginTop="4px">
                                        <AnchorLinkIcon href={list[0].file} />
                                    </Box>
                                    <Box marginTop="2px">{list[0].file}</Box>
                                </Box>
                            </DetailBlock>
                        </Box>

                        {list[0].error_trace === 'Undefined' ? (
                            <Alert severity="warning">
                                Stack trace is not available for this error
                            </Alert>
                        ) : (
                            <TraceBox trace={list[0].error_trace} />
                        )}
                        <Box mt={2} />
                        <CodeBox
                            fileUrl={list[0].file}
                            errorRow={parseInt(list[0].row)}
                            errorCol={parseInt(list[0].column)}
                        />
                        <Box mt={2} />
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
