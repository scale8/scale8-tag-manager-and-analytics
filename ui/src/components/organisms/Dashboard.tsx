import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, Container, Grid, IconButton, Tooltip, Typography } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    card: {
        height: '100%',
        padding: theme.spacing(2),
        display: 'flex',
        border: '1px solid rgba(0, 0, 0, 0.12)',
    },
    cardAction: {
        paddingLeft: theme.spacing(1),
        fontSize: '16px',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    cardContent: {
        flexGrow: 1,
    },
}));

export type DashboardSection = {
    title: string;
    content: () => JSX.Element;
    linkText: string;
    action?: () => void;
};

export type DashboardProps = {
    dashboardSections: DashboardSection[];
};

const Dashboard: FC<DashboardProps> = (props: DashboardProps) => {
    const classes = useStyles();

    return (
        <Container className={classes.cardGrid} maxWidth="xl">
            <Grid container spacing={4}>
                {props.dashboardSections.map((_, index) => (
                    <Grid item key={index} xs={12} sm={12} md={6} lg={4}>
                        <Card elevation={0} className={classes.card}>
                            <div className={classes.cardContent}>
                                <Typography gutterBottom variant="h6" component="h2">
                                    {_.title}
                                </Typography>
                                {_.content()}
                            </div>
                            {_.action !== undefined && (
                                <div className={classes.cardAction}>
                                    <Box>
                                        <Tooltip title={_.linkText}>
                                            <IconButton onClick={_.action} aria-label={_.linkText}>
                                                <ArrowForwardIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </div>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export { Dashboard };
