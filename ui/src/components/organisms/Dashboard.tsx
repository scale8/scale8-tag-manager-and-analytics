import { FC } from 'react';
import { Box, Card, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
    return (
        <Box
            sx={{
                padding: (theme) => theme.spacing(4, 3),
            }}
        >
            <Grid container spacing={4}>
                {props.dashboardSections.map((_, index) => (
                    <Grid item key={index} xs={12} sm={12} md={6} lg={4}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                padding: 2,
                                display: 'flex',
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                            }}
                        >
                            <Box
                                sx={{
                                    flexGrow: 1,
                                }}
                            >
                                <Typography gutterBottom variant="h6" component="h2">
                                    {_.title}
                                </Typography>
                                {_.content()}
                            </Box>
                            {_.action !== undefined && (
                                <Box
                                    sx={{
                                        paddingLeft: 1,
                                        fontSize: '16px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Box>
                                        <Tooltip title={_.linkText}>
                                            <IconButton
                                                onClick={_.action}
                                                aria-label={_.linkText}
                                                size="large"
                                            >
                                                <ArrowForwardIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export { Dashboard };
