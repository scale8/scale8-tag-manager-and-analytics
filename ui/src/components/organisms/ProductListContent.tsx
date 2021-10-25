import { FC } from 'react';
import { Box, Card, Grid, Typography } from '@mui/material';
import { ButtonSelector } from '../molecules/ProductList/ButtonSelector';
import {
    ListProductData,
    ProductListProps,
} from '../../dialogPages/global/orgSettings/ProductList';
import { PageActionProps } from '../../actions/PageActions';

export const ProductListContent: FC<
    ProductListProps & {
        products: ListProductData[];
        currentProductId: string | null;
        pageActionProps: PageActionProps;
    }
> = ({ products, currentProductId, pageActionProps, ...props }) => {
    return (
        <Grid container spacing={4}>
            {products.map((_, index) => (
                <Grid item key={index} xs={12} sm={12} md={6} lg={4}>
                    <Card
                        elevation={0}
                        sx={{
                            height: '100%',
                            padding: (theme) => theme.spacing(2, 2, 2, 2),
                            display: 'flex',
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                        }}
                    >
                        <Box
                            sx={{
                                textAlign: 'center',
                                flexGrow: 1,
                            }}
                        >
                            <Box mt={2} />
                            <Box fontSize="1.5em" fontWeight="bold" textAlign="center">
                                ${_.amount / 100} / Month
                            </Box>
                            {_.page_views !== undefined && (
                                <>
                                    <b>{_.page_views.toLocaleString('en-GB')}</b> Page Views
                                </>
                            )}
                            {_.requests !== undefined && (
                                <Typography>
                                    <b>{_.requests.toLocaleString('en-GB')}</b> Request
                                </Typography>
                            )}
                            {_.gbs !== undefined && (
                                <Typography>
                                    <b>{_.gbs.toLocaleString('en-GB')}</b> GBs
                                </Typography>
                            )}
                            <Box pt={2} />
                            <Box textAlign="center" mt={2}>
                                <ButtonSelector
                                    {...props}
                                    product={_}
                                    pageActionProps={pageActionProps}
                                    currentProductId={currentProductId}
                                />
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};
