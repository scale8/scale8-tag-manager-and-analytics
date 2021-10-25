import { FC } from 'react';
import { Box, Button } from '@mui/material';
import DangerBox from '../../../components/molecules/DangerBox';
import { PageActionProps, pageActions } from '../../../actions/PageActions';
import { AccountProduct } from '../../../gql/generated/globalTypes';
import { useLoggedInState } from '../../../context/AppContext';
import { OrgSettingsSectionProps } from '../../../types/props/OrgSettingsSectionProps';

export type UnsubscribeSectionProps = OrgSettingsSectionProps & {
    accountProduct: AccountProduct;
    valuesRefresh: (mustResetCache: boolean) => void;
};

const UnsubscribeSection: FC<UnsubscribeSectionProps> = (props: UnsubscribeSectionProps) => {
    const { data, valuesRefresh } = props;
    const { templateInteractions } = useLoggedInState();
    const { ask, dispatchDialogAction } = templateInteractions;

    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
        refresh: () => {
            valuesRefresh(true);
        },
    };

    const accountProductName =
        props.accountProduct === AccountProduct.TAG_MANAGER ? 'Tag Manager' : 'Data Manager';

    if (
        props.accountProduct === AccountProduct.TAG_MANAGER &&
        (data.getOrg.tag_manager_account === null ||
            (data.getOrg.tag_manager_account.stripe_product_id === null &&
                !data.getOrg.manual_invoicing))
    ) {
        return null;
    }

    if (
        props.accountProduct === AccountProduct.DATA_MANAGER &&
        (data.getOrg.data_manager_account === null ||
            (data.getOrg.data_manager_account.stripe_product_id === null &&
                !data.getOrg.manual_invoicing))
    ) {
        return null;
    }

    return (
        <>
            <Box height={32} />
            <DangerBox>
                Account reset cannot be undone. Please be certain.
                <br />
                All data and subscriptions will be removed.
                <Box py={3}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            ask(`Do you want to unsubscribe from ${accountProductName}?`, () => {
                                pageActions.accountUnsubscribe(
                                    pageActionProps,
                                    data.getOrg.id,
                                    props.accountProduct,
                                );
                            });
                        }}
                        sx={{
                            color: '#ffffff',
                            backgroundColor: (theme) => theme.palette.error.main,
                        }}
                        disableElevation
                    >
                        Reset {accountProductName} Account
                    </Button>
                </Box>
            </DangerBox>
        </>
    );
};

export default UnsubscribeSection;
