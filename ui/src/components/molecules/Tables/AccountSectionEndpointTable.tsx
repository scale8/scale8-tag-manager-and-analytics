import { FC } from 'react';
import {
    Box,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Theme,
    Tooltip,
} from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/router';
import { toDataManager, toIngestEndpoint } from '../../../utils/NavigationPaths';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        headerCell: {
            paddingLeft: 0,
        },
        contentCell: {
            paddingLeft: 0,
            borderBottom: 0,
            '&:last-of-type': {
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
        button: {
            color: '#ffffff',
            backgroundColor: theme.palette.dataManagerColor.main,
            width: '100%',
            '&:hover': {
                color: '#ffffff',
                backgroundColor: theme.palette.dataManagerColor.main,
            },
        },
    }),
);

export type AccountSectionAppTableProps = {
    endpoints: {
        name: string;
        id: string;
        bytes: number[];
        requests: number[];
    }[];
    dmId: string;
};

const AccountSectionEndpointTable: FC<AccountSectionAppTableProps> = (
    props: AccountSectionAppTableProps,
) => {
    const classes = useStyles();

    const router = useRouter();

    const { endpoints, dmId } = props;

    if (endpoints.length === 0) {
        return (
            <Button
                variant="contained"
                onClick={() => {
                    router.push(toDataManager({ id: dmId })).then();
                }}
                className={classes.button}
                color="inherit"
                disableElevation
            >
                Manage Endpoints
            </Button>
        );
    }

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.headerCell}>Endpoints</TableCell>
                        <TableCell className={classes.headerCell}>Requests</TableCell>
                        <TableCell className={classes.headerCell}>Bytes</TableCell>
                        <TableCell className={classes.headerCell} align="right" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {endpoints.map((endpoint) => (
                        <TableRow key={endpoint.id}>
                            <TableCell className={classes.contentCell}>{endpoint.name}</TableCell>
                            <TableCell className={classes.contentCell}>
                                <Box width={70}>
                                    <Sparklines data={endpoint.requests} width={70} height={20}>
                                        <SparklinesLine style={{ fill: 'none' }} />
                                    </Sparklines>
                                </Box>
                            </TableCell>
                            <TableCell className={classes.contentCell}>
                                <Box width={70}>
                                    <Sparklines data={endpoint.bytes} width={70} height={20}>
                                        <SparklinesLine style={{ fill: 'none' }} />
                                    </Sparklines>
                                </Box>
                            </TableCell>
                            <TableCell className={classes.contentCell} align="right">
                                <Tooltip title="Select Application">
                                    <IconButton
                                        onClick={() => {
                                            router
                                                .push(toIngestEndpoint({ id: endpoint.id }))
                                                .then();
                                        }}
                                        aria-label="Select Application"
                                        size="large"
                                    >
                                        <ArrowForwardIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export { AccountSectionEndpointTable };
