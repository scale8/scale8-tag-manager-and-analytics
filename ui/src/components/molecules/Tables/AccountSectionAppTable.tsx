import { FC } from 'react';
import {
    Box,
    Button,
    createStyles,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Theme,
    Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { useRouter } from 'next/router';
import { toApp, toTagManager } from '../../../utils/NavigationPaths';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        headerCell: {
            paddingLeft: 0,
        },
        contentCell: {
            paddingLeft: 0,
            borderBottom: 0,
            '&:last-child': {
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
        button: {
            color: '#ffffff',
            backgroundColor: theme.palette.tagManagerColor.main,
            width: '100%',
            '&:hover': {
                color: '#ffffff',
                backgroundColor: theme.palette.tagManagerColor.main,
            },
        },
    }),
);

export type AccountSectionAppTableProps = {
    applications: { name: string; pageViews: number[]; id: string }[];
    tmId: string;
};

const AccountSectionAppTable: FC<AccountSectionAppTableProps> = (
    props: AccountSectionAppTableProps,
) => {
    const classes = useStyles();

    const router = useRouter();

    const { applications, tmId } = props;

    if (applications.length === 0) {
        return (
            <Button
                variant="contained"
                onClick={() => {
                    router.push(toTagManager({ id: tmId }, 'apps')).then();
                }}
                className={classes.button}
                color="inherit"
                disableElevation
            >
                Manage Applications
            </Button>
        );
    }

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.headerCell}>Applications</TableCell>
                        <TableCell className={classes.headerCell}>Page views</TableCell>
                        <TableCell className={classes.headerCell} align="right" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {applications.map((app) => (
                        <TableRow key={app.id}>
                            <TableCell className={classes.contentCell}>{app.name}</TableCell>
                            <TableCell className={classes.contentCell}>
                                <Box width={150}>
                                    <Sparklines data={app.pageViews} width={150} height={20}>
                                        <SparklinesLine style={{ fill: 'none' }} />
                                    </Sparklines>
                                </Box>
                            </TableCell>
                            <TableCell className={classes.contentCell} align="right">
                                <Tooltip title="Select Application">
                                    <IconButton
                                        onClick={() => {
                                            router.push(toApp({ id: app.id })).then();
                                        }}
                                        aria-label="Select Application"
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

export { AccountSectionAppTable };
