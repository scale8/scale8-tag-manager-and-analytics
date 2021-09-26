import { makeStyles } from '@material-ui/core/styles';
import { FC, ReactNode } from 'react';
import { Card, Container, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        padding: theme.spacing(0, 0, 4, 0),
    },
    card: {
        height: '100%',
        padding: theme.spacing(2),
        display: 'flex',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: '4px',
    },
}));

export type ChartPageContentProps = {
    summaryBlock: ReactNode;
    chartBlock: ReactNode;
    listsBlock: ReactNode[];
    bigListBlock?: ReactNode;
};

const ChartPageContent: FC<ChartPageContentProps> = (props: ChartPageContentProps) => {
    const classes = useStyles();

    return (
        <Container className={classes.cardGrid} maxWidth="xl">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card className={classes.card} elevation={0}>
                        {props.summaryBlock}
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card className={classes.card} style={{ minHeight: '432px' }} elevation={0}>
                        {props.chartBlock}
                    </Card>
                </Grid>
                {props.listsBlock.map((listComponent, index) => (
                    <Grid item xs={12} sm={12} md={12} lg={6} key={index}>
                        {listComponent}
                    </Grid>
                ))}
                {props.bigListBlock && (
                    <Grid item xs={12}>
                        {props.bigListBlock}
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default ChartPageContent;
