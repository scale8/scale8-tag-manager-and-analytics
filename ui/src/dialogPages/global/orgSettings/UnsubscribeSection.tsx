import { FC } from 'react';
import { Box, Button, lighten } from '@mui/material';
import { AccountProduct } from '../../../gql/generated/globalTypes';
import { DialogPageProps } from '../../../types/DialogTypes';
import { MainDrawerTitle } from '../../../components/molecules/MainDrawerTitle';
import { PageActionProps, pageActions } from '../../../actions/PageActions';
import { useLoggedInState } from '../../../context/AppContext';

export type UnsubscribeSectionProps = DialogPageProps & {
    accountProduct: AccountProduct;
};

const UnsubscribeSection: FC<UnsubscribeSectionProps> = ({ accountProduct, ...dialogProps }) => {
    const { templateInteractions } = useLoggedInState();
    const { ask, dispatchDialogAction } = templateInteractions;

    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
        refresh: dialogProps.pageRefresh,
    };

    const accountProductName =
        accountProduct === AccountProduct.TAG_MANAGER ? 'Tag Manager' : 'Data Manager';
    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <MainDrawerTitle handleDialogClose={dialogProps.handleDialogClose}>
                Cancel Plan
            </MainDrawerTitle>
            <Box p={3}>
                Unsubscribing from {accountProductName} Account will reset you account.
                <br />
                Account reset cannot be undone.
                <br />
                All data and subscriptions will be removed.
                <br />
                <b>Please be certain.</b>
                <Box py={3}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            ask(
                                `Are you sure you want to unsubscribe from ${accountProductName}?`,
                                () => {
                                    pageActions.accountUnsubscribe(
                                        pageActionProps,
                                        dialogProps.id,
                                        accountProduct,
                                    );
                                },
                            );
                        }}
                        sx={{
                            color: '#ffffff',
                            backgroundColor: (theme) => lighten(theme.palette.error.main, 0.2),
                            '&:hover': {
                                backgroundColor: (theme) => theme.palette.error.main,
                            },
                        }}
                        disableElevation
                    >
                        Unsubscribe from {accountProductName} Account
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default UnsubscribeSection;
