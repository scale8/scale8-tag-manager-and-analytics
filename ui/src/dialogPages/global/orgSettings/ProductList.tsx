import makeStyles from '@mui/styles/makeStyles';
import { FC } from 'react';
import { Box, Button, Card, Grid, Typography, useTheme } from '@mui/material';
import { PageActionProps, pageActions } from '../../../actions/PageActions';
import { AccountProduct } from '../../../gql/generated/globalTypes';
import { useConfigState, useLoggedInState } from '../../../context/AppContext';
import { OrgSettingsSectionProps } from '../../../types/props/OrgSettingsSectionProps';
import { buildThankYouPath } from '../../../utils/NavigationPaths';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    card: {
        height: '100%',
        padding: theme.spacing(2, 2, 2, 2),
        display: 'flex',
        border: '1px solid rgba(0, 0, 0, 0.12)',
    },
    cardContent: {
        textAlign: 'center',
        flexGrow: 1,
    },
}));

export type ProductListProps = OrgSettingsSectionProps & {
    accountProduct: AccountProduct;
    valuesRefresh: (mustResetCache: boolean) => void;
};

export type ListProductData = {
    id: string;
    name: string;
    amount: number;
    page_views?: number;
    requests?: number;
    gbs?: number;
};

export type ButtonProps = ProductListProps & {
    product: ListProductData;
    pageActionProps: PageActionProps;
    currentProductId: string | null;
};

const SelectPlanButton: FC<ButtonProps> = (props: ButtonProps) => {
    const { templateInteractions } = useLoggedInState();
    const { ask } = templateInteractions;

    const { data, product, pageActionProps } = props;
    const theme = useTheme();

    const router = useRouter();

    return (
        <Button
            variant="contained"
            onClick={() => {
                if (data.getOrg.is_paid) {
                    ask(`Do you want to add ${product.name} to your subscription?`, () => {
                        pageActions.accountSubscribe(
                            pageActionProps,
                            data.getOrg.id,
                            product.id,
                            props.accountProduct,
                            () => {
                                router
                                    .push(
                                        buildThankYouPath(
                                            data.getOrg.id,
                                            product.id,
                                            props.accountProduct,
                                        ),
                                    )
                                    .then();
                            },
                        );
                    });
                } else {
                    pageActions.accountSubscribe(
                        pageActionProps,
                        data.getOrg.id,
                        product.id,
                        props.accountProduct,
                    );
                }
            }}
            style={{
                color: '#ffffff',
                backgroundColor:
                    props.accountProduct === AccountProduct.TAG_MANAGER
                        ? theme.palette.tagManagerColor.main
                        : theme.palette.dataManagerColor.main,
                width: '100%',
            }}
            color="inherit"
            disableElevation
        >
            Select Plan
        </Button>
    );
};

const SwitchPlanButton: FC<ButtonProps> = (props: ButtonProps) => {
    const { templateInteractions } = useLoggedInState();
    const { ask } = templateInteractions;
    const { data, product, pageActionProps } = props;
    const theme = useTheme();
    const router = useRouter();

    return (
        <Button
            variant="contained"
            onClick={() => {
                ask(`Do you want to switch to ${product.name}?`, () => {
                    pageActions.accountSubscribe(
                        pageActionProps,
                        data.getOrg.id,
                        product.id,
                        props.accountProduct,
                        () => {
                            router
                                .push(
                                    buildThankYouPath(
                                        data.getOrg.id,
                                        product.id,
                                        props.accountProduct,
                                    ),
                                )
                                .then();
                        },
                    );
                });
            }}
            style={{
                color: '#ffffff',
                backgroundColor:
                    props.accountProduct === AccountProduct.TAG_MANAGER
                        ? theme.palette.tagManagerColor.main
                        : theme.palette.dataManagerColor.main,
                width: '100%',
            }}
            color="inherit"
            disableElevation
        >
            Switch to this Plan
        </Button>
    );
};

const CurrentButton: FC = () => {
    return (
        <Button
            variant="contained"
            style={{
                color: 'inherit',
                backgroundColor: '#eeeeee',
                width: '100%',
            }}
            color="inherit"
            disableElevation
            disabled
        >
            Current Plan
        </Button>
    );
};

const ButtonSelector: FC<ButtonProps> = (props: ButtonProps) => {
    const { currentProductId, product } = props;
    if (currentProductId === null) {
        return <SelectPlanButton {...props} />;
    }
    if (currentProductId === product.id) {
        return <CurrentButton />;
    }
    return <SwitchPlanButton {...props} />;
};

const ProductList: FC<ProductListProps> = (props: ProductListProps) => {
    const classes = useStyles();

    const { tagManagerProducts, dataManagerProducts } = useConfigState();

    const { data } = props;

    const { templateInteractions } = useLoggedInState();
    const { dispatchDialogAction, setRefreshCurrentPage } = templateInteractions;

    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
        refresh: () => {
            setRefreshCurrentPage(true);
        },
    };

    const products: ListProductData[] =
        props.accountProduct === AccountProduct.TAG_MANAGER
            ? tagManagerProducts
            : dataManagerProducts;

    const tagManagerAccount = data.getOrg.tag_manager_account;
    const tagManagerProductId =
        tagManagerAccount === null ? null : tagManagerAccount.stripe_product_id;
    const dataManagerAccount = data.getOrg.data_manager_account;
    const dataManagerProductId =
        dataManagerAccount === null ? null : dataManagerAccount.stripe_product_id;
    const currentProductId =
        props.accountProduct === AccountProduct.TAG_MANAGER
            ? tagManagerProductId
            : dataManagerProductId;

    if (data.getOrg.manual_invoicing) {
        return (
            <>
                Your organization is using a <b>BESPOKE</b> plan.
            </>
        );
    }

    return (
        <Grid container spacing={4}>
            {products.map((_, index) => (
                <Grid item key={index} xs={12} sm={12} md={6} lg={4}>
                    <Card elevation={0} className={classes.card}>
                        <div className={classes.cardContent}>
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
                        </div>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductList;
