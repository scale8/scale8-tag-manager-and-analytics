import { FC, useEffect } from 'react';
import { ProductSettings } from '../../gql/generated/ProductSettings';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import { PageActionProps, pageActions } from '../../actions/PageActions';
import { Box, Button, Card, darken, Grid, lighten } from '@mui/material';
import TmLogo from '../atoms/TmLogo';
import DmLogo from '../atoms/DmLogo';

type AccountPlanCardProps = {
    data: ProductSettings;
    type: 'tag' | 'data';
};

const accountDetailsFromProductSettings = (data: ProductSettings) => {
    const tagManagerAccount = data.getOrg.tag_manager_account;
    const tagManagerProductId =
        tagManagerAccount === null ? null : tagManagerAccount.stripe_product_id;
    const dataManagerAccount = data.getOrg.data_manager_account;
    const dataManagerProductId =
        dataManagerAccount === null ? null : dataManagerAccount.stripe_product_id;

    return {
        tagManagerAccount,
        tagManagerProductId,
        dataManagerAccount,
        dataManagerProductId,
    };
};

const AccountPlanCard: FC<AccountPlanCardProps> = ({ data, type }) => {
    const { tagManagerProducts, dataManagerProducts } = useConfigState();
    const { templateInteractions } = useLoggedInState();
    const { dispatchDialogAction, setRefreshCurrentPage } = templateInteractions;

    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
        refresh: () => {
            setRefreshCurrentPage(true);
        },
    };

    const { tagManagerAccount, tagManagerProductId, dataManagerAccount, dataManagerProductId } =
        accountDetailsFromProductSettings(data);

    const currentTagManagerProduct = tagManagerProductId
        ? tagManagerProducts.find((_) => _.id === tagManagerProductId)
        : undefined;

    const currentDataManagerProduct = dataManagerProductId
        ? dataManagerProducts.find((_) => _.id === dataManagerProductId)
        : undefined;

    const tagManagerDetails = (() => {
        if (tagManagerAccount === null) {
            return {
                state: 'Inactive',
                pageViews: '',
                price: '',
            };
        }
        if (data.getOrg.manual_invoicing) {
            return {
                state: 'Manual Invoicing',
                pageViews: '',
                price: '',
            };
        }
        if (tagManagerAccount.is_trial && tagManagerAccount.trial_expired) {
            return {
                state: 'Trial Expired',
                pageViews: '',
                price: '',
            };
        }
        if (tagManagerAccount.is_trial) {
            return {
                state: 'Trial',
                pageViews: '',
                price: '',
            };
        }
        return {
            state: 'Active',
            pageViews: currentTagManagerProduct?.page_views?.toLocaleString('en-GB') ?? '',
            price: (currentTagManagerProduct?.amount ?? 0) / 100,
        };
    })();

    const dataManagerDetails = (() => {
        if (dataManagerAccount === null) {
            return {
                state: 'Inactive',
                requests: '',
                gbs: '',
                price: '',
            };
        }
        if (data.getOrg.manual_invoicing) {
            return {
                state: 'Manual Invoicing',
                requests: '',
                gbs: '',
                price: '',
            };
        }
        if (dataManagerAccount.is_trial && dataManagerAccount.trial_expired) {
            return {
                state: 'Trial Expired',
                requests: '',
                gbs: '',
                price: '',
            };
        }
        if (dataManagerAccount.is_trial) {
            return {
                state: 'Trial',
                requests: '',
                gbs: '',
                price: '',
            };
        }
        return {
            state: 'Active',
            requests: currentDataManagerProduct?.requests?.toLocaleString('en-GB') ?? '',
            gbs: currentDataManagerProduct?.gbs?.toLocaleString('en-GB') ?? '',
            price: (currentDataManagerProduct?.amount ?? 0) / 100,
        };
    })();

    const currentState = type === 'tag' ? tagManagerDetails.state : dataManagerDetails.state;

    return (
        <Card
            elevation={0}
            sx={{
                flex: 1,
                padding: (theme) => theme.spacing(2, 2, 2, 2),
                display: 'flex',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                gap: (theme) => theme.spacing(2),
                alignItems: 'center',
            }}
        >
            {type === 'tag' ? (
                <>
                    <TmLogo height={25} />
                    <Box display="flex" alignItems="center" gap={2} fontSize="1.2em">
                        <Box>Tag Manager Plan: </Box>
                        {tagManagerDetails.state === 'Active' ? (
                            <>
                                <Box>
                                    <b>{tagManagerDetails.pageViews}</b> Page Views
                                </Box>
                                <Box fontWeight="bold">${tagManagerDetails.price} / Month</Box>
                            </>
                        ) : (
                            <Box>
                                <b>{tagManagerDetails.state}</b>
                            </Box>
                        )}
                    </Box>
                </>
            ) : (
                <>
                    <DmLogo height={25} />
                    <Box display="flex" alignItems="center" gap={2} fontSize="1.2em">
                        <Box>Data Manager Plan: </Box>
                        {dataManagerDetails.state === 'Active' ? (
                            <>
                                <Box>
                                    <b>{dataManagerDetails.requests}</b> Request
                                </Box>{' '}
                                <Box>
                                    <b>{dataManagerDetails.gbs}</b> GBs
                                </Box>
                                <Box fontWeight="bold">${dataManagerDetails.price} / Month</Box>
                            </>
                        ) : (
                            <Box>
                                <b>{dataManagerDetails.state}</b>
                            </Box>
                        )}
                    </Box>
                </>
            )}

            <Box flex={1} />
            <Button
                variant="contained"
                sx={
                    type === 'tag'
                        ? {
                              color: '#ffffff',
                              backgroundColor: (theme) => theme.palette.tagManagerColor.main,
                              '&:hover': {
                                  backgroundColor: (theme) =>
                                      darken(theme.palette.tagManagerColor.main, 0.2),
                              },
                          }
                        : {
                              color: '#ffffff',
                              backgroundColor: (theme) => theme.palette.dataManagerColor.main,
                              '&:hover': {
                                  backgroundColor: (theme) =>
                                      darken(theme.palette.dataManagerColor.main, 0.2),
                              },
                          }
                }
                disableElevation
                onClick={() => {
                    type === 'tag'
                        ? pageActions.tagManagerPlanSelector(
                              pageActionProps,
                              data.getOrg.id,
                              data.getOrg.is_paid ? 'paid' : 'free',
                              tagManagerProductId ?? undefined,
                          )
                        : pageActions.dataManagerPlanSelector(
                              pageActionProps,
                              data.getOrg.id,
                              data.getOrg.is_paid ? 'paid' : 'free',
                              dataManagerProductId ?? undefined,
                          );
                }}
            >
                {type === 'tag'
                    ? currentTagManagerProduct
                        ? 'Change'
                        : 'Select'
                    : currentDataManagerProduct
                    ? 'Change'
                    : 'Select'}{' '}
                Plan
            </Button>
            {currentState === 'Active' && (
                <Button
                    variant="contained"
                    sx={{
                        color: '#ffffff',
                        backgroundColor: (theme) => lighten(theme.palette.primary.main, 0.3),
                        '&:hover': {
                            backgroundColor: (theme) => theme.palette.primary.main,
                        },
                    }}
                    disableElevation
                    onClick={() => {
                        type === 'tag'
                            ? pageActions.cancelTagManagerPlan(pageActionProps, data.getOrg.id)
                            : pageActions.cancelDataManagerPlan(pageActionProps, data.getOrg.id);
                    }}
                >
                    Cancel plan
                </Button>
            )}
        </Card>
    );
};

const AccountPlans: FC<{ data: ProductSettings; plan?: string }> = (props: {
    data: ProductSettings;
    plan?: string;
}) => {
    const { data, plan } = props;
    const { templateInteractions } = useLoggedInState();
    const { dispatchDialogAction, setRefreshCurrentPage } = templateInteractions;

    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
        refresh: () => {
            setRefreshCurrentPage(true);
        },
    };

    const { tagManagerProductId, dataManagerProductId } = accountDetailsFromProductSettings(data);

    useEffect(() => {
        if (plan === 'tag') {
            pageActions.tagManagerPlanSelector(
                pageActionProps,
                data.getOrg.id,
                data.getOrg.is_paid ? 'paid' : 'free',
                tagManagerProductId ?? undefined,
            );
        }
        if (plan === 'data') {
            pageActions.dataManagerPlanSelector(
                pageActionProps,
                data.getOrg.id,
                data.getOrg.is_paid ? 'paid' : 'free',
                dataManagerProductId ?? undefined,
            );
        }
    }, []);

    if (data.getOrg.manual_invoicing) {
        return (
            <>
                Your organization is using a <b>BESPOKE</b> plan.
            </>
        );
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={6}>
                <AccountPlanCard data={data} type="tag" />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
                <AccountPlanCard data={data} type="data" />
            </Grid>
        </Grid>
    );
};

export default AccountPlans;
