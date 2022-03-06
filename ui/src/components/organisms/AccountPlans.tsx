import { FC } from 'react';
import { ProductSettings } from '../../gql/generated/ProductSettings';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import { PageActionProps, pageActions } from '../../actions/PageActions';
import { Box, Button, Card, darken } from '@mui/material';
import TmLogo from '../atoms/TmLogo';
import DmLogo from '../atoms/DmLogo';

const AccountPlans: FC<{ data: ProductSettings }> = (props: { data: ProductSettings }) => {
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

    const tagManagerAccount = data.getOrg.tag_manager_account;
    const tagManagerProductId =
        tagManagerAccount === null ? null : tagManagerAccount.stripe_product_id;
    const dataManagerAccount = data.getOrg.data_manager_account;
    const dataManagerProductId =
        dataManagerAccount === null ? null : dataManagerAccount.stripe_product_id;

    const currentTagManagerProduct = tagManagerProductId
        ? tagManagerProducts.find((_) => _.id === tagManagerProductId)
        : undefined;

    const currentDataManagerProduct = dataManagerProductId
        ? dataManagerProducts.find((_) => _.id === dataManagerProductId)
        : undefined;

    if (data.getOrg.manual_invoicing) {
        return (
            <>
                Your organization is using a <b>BESPOKE</b> plan.
            </>
        );
    }

    return (
        <Box display="flex" gap={2}>
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
                <TmLogo height={25} />
                <Box display="flex" alignItems="center" gap={2} fontSize="1.2em">
                    <Box>Tag Manager Plan: </Box>
                    {currentTagManagerProduct && currentTagManagerProduct.page_views ? (
                        <>
                            <Box>
                                <b>{currentTagManagerProduct.page_views.toLocaleString('en-GB')}</b>{' '}
                                Page Views
                            </Box>
                            <Box fontWeight="bold">
                                ${currentTagManagerProduct.amount / 100} / Month
                            </Box>
                        </>
                    ) : (
                        <Box>
                            <b>Trial</b>
                        </Box>
                    )}
                </Box>
                <Box flex={1} />
                <Button
                    variant="contained"
                    sx={{
                        color: '#ffffff',
                        backgroundColor: (theme) => theme.palette.tagManagerColor.main,
                        '&:hover': {
                            backgroundColor: (theme) =>
                                darken(theme.palette.tagManagerColor.main, 0.2),
                        },
                    }}
                    disableElevation
                    onClick={() => {
                        pageActions.tagManagerPlanSelector(
                            pageActionProps,
                            tagManagerProductId ?? undefined,
                        );
                    }}
                >
                    {currentTagManagerProduct ? 'Change' : 'Select'} Plan
                </Button>
            </Card>
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
                <DmLogo height={25} />
                <Box display="flex" alignItems="center" gap={2} fontSize="1.2em">
                    <Box>Data Manager Plan: </Box>
                    {currentDataManagerProduct &&
                    currentDataManagerProduct.requests &&
                    currentDataManagerProduct.gbs ? (
                        <>
                            <Box>
                                <b>{currentDataManagerProduct.requests.toLocaleString('en-GB')}</b>{' '}
                                Request
                            </Box>{' '}
                            <Box>
                                <b>{currentDataManagerProduct.gbs.toLocaleString('en-GB')}</b> GBs
                            </Box>
                            <Box fontWeight="bold">
                                ${currentDataManagerProduct.amount / 100} / Month
                            </Box>
                        </>
                    ) : (
                        <Box>
                            <b>Trial</b>
                        </Box>
                    )}
                </Box>
                <Box flex={1} />
                <Button
                    variant="contained"
                    sx={{
                        color: '#ffffff',
                        backgroundColor: (theme) => theme.palette.dataManagerColor.main,
                        '&:hover': {
                            backgroundColor: (theme) =>
                                darken(theme.palette.dataManagerColor.main, 0.2),
                        },
                    }}
                    disableElevation
                    onClick={() => {
                        pageActions.dataManagerPlanSelector(
                            pageActionProps,
                            dataManagerProductId ?? undefined,
                        );
                    }}
                >
                    {currentDataManagerProduct ? 'Change' : 'Select'} Plan
                </Button>
            </Card>
        </Box>
    );
};

export default AccountPlans;
