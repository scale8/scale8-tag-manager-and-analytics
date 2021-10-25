import { FC } from 'react';
import { useLoggedInState } from '../../../context/AppContext';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { pageActions } from '../../../actions/PageActions';
import { buildThankYouPath } from '../../../utils/NavigationPaths';
import { AccountProduct } from '../../../gql/generated/globalTypes';
import { ProductListButtonProps } from '../../../dialogPages/global/orgSettings/ProductList';

export const SwitchPlanButton: FC<ProductListButtonProps> = (props: ProductListButtonProps) => {
    const { templateInteractions } = useLoggedInState();
    const { ask } = templateInteractions;
    const { data, product, pageActionProps } = props;
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
            sx={{
                color: '#ffffff',
                backgroundColor: (theme) =>
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
