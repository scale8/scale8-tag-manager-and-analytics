import { FC, ReactNode } from 'react';
import { Box, Card, Grid } from '@mui/material';

export type ChartPageContentProps = {
    summaryBlock: ReactNode;
    chartBlock: ReactNode;
    listsBlock: ReactNode[];
    bigListBlock?: ReactNode;
};

const ChartPageContent: FC<ChartPageContentProps> = (props: ChartPageContentProps) => {
    return (
        <Box sx={{ padding: (theme) => theme.spacing(0, 0, 4, 0) }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card
                        sx={{
                            height: '100%',
                            padding: (theme) => theme.spacing(2),
                            display: 'flex',
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: '4px',
                        }}
                        elevation={0}
                    >
                        {props.summaryBlock}
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card
                        sx={{
                            height: '100%',
                            padding: (theme) => theme.spacing(2),
                            display: 'flex',
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: '4px',
                            minHeight: '300px',
                        }}
                        elevation={0}
                    >
                        {props.chartBlock}
                    </Card>
                </Grid>
                {props.bigListBlock && (
                    <Grid item xs={12}>
                        {props.bigListBlock}
                    </Grid>
                )}
                {props.listsBlock.map((listComponent, index) => (
                    <Grid item xs={12} sm={12} md={12} lg={6} key={index}>
                        {listComponent}
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ChartPageContent;
