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
import { Sparklines, SparklinesLine } from 'react-sparklines';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/router';
import { toDataManager, toIngestEndpoint } from '../../../utils/NavigationPaths';
import { SxProps } from '@mui/system';
import { useSparkLineStyle } from '../../../hooks/useSparkLineStyle';

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
    const router = useRouter();

    const sparkLineStyle = useSparkLineStyle();

    const { endpoints, dmId } = props;

    if (endpoints.length === 0) {
        return (
            <Button
                variant="contained"
                onClick={() => {
                    router.push(toDataManager({ id: dmId })).then();
                }}
                sx={{
                    color: '#ffffff',
                    backgroundColor: (theme) => theme.palette.tagManagerColor.main,
                    width: '100%',
                    '&:hover': {
                        color: '#ffffff',
                        backgroundColor: (theme) => theme.palette.tagManagerColor.main,
                    },
                }}
                color="inherit"
                disableElevation
            >
                Manage Endpoints
            </Button>
        );
    }

    const headerCell: SxProps<Theme> = {
        paddingLeft: 0,
    };

    const contentCell: SxProps<Theme> = {
        paddingLeft: 0,
        borderBottom: 0,
        '&:last-of-type': {
            paddingLeft: 0,
            paddingRight: 0,
        },
    };

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={headerCell}>Endpoints</TableCell>
                        <TableCell sx={headerCell}>Requests</TableCell>
                        <TableCell sx={headerCell}>Bytes</TableCell>
                        <TableCell sx={headerCell} align="right" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {endpoints.map((endpoint) => (
                        <TableRow key={endpoint.id}>
                            <TableCell sx={contentCell}>{endpoint.name}</TableCell>
                            <TableCell sx={contentCell}>
                                <Box width={70}>
                                    <Sparklines data={endpoint.requests} width={70} height={20}>
                                        <SparklinesLine style={sparkLineStyle} />
                                    </Sparklines>
                                </Box>
                            </TableCell>
                            <TableCell sx={contentCell}>
                                <Box width={70}>
                                    <Sparklines data={endpoint.bytes} width={70} height={20}>
                                        <SparklinesLine style={sparkLineStyle} />
                                    </Sparklines>
                                </Box>
                            </TableCell>
                            <TableCell sx={contentCell} align="right">
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
