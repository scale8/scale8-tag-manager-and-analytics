import { FC } from 'react';
import { Box, Button } from '@mui/material';
import { PageActionProps, pageActions } from '../../../actions/PageActions';
import { useLoggedInState } from '../../../context/AppContext';
import { OrgSettingsSectionProps } from '../../../types/props/OrgSettingsSectionProps';

const PaymentInformationSection: FC<OrgSettingsSectionProps> = (props: OrgSettingsSectionProps) => {
    const { data } = props;

    const { templateInteractions } = useLoggedInState();
    const { dispatchDialogAction } = templateInteractions;

    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
        refresh: () => {
            // no need to refresh
        },
    };

    if (!data.getOrg.has_billing) return null;

    return (
        <>
            Invoicing and payments are managed via <b>STRIPE</b>.
            <Box pt={3}>
                <Button
                    variant="contained"
                    onClick={() => {
                        pageActions.openBillingPage(pageActionProps, data.getOrg.id);
                    }}
                    sx={{
                        color: '#ffffff',
                        backgroundColor: (theme) => theme.palette.commonColor.main,
                    }}
                    disableElevation
                >
                    Manage Payments and invoices
                </Button>
            </Box>
            <Box height={32} />
        </>
    );
};

export default PaymentInformationSection;
