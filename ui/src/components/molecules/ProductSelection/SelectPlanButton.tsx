import { FC } from 'react';
import { useLoggedInState } from '../../../context/AppContext';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { pageActions } from '../../../actions/PageActions';
import { buildThankYouPath } from '../../../utils/NavigationPaths';
import { AccountProduct } from '../../../gql/generated/globalTypes';
import { ProductButtonProps } from '../../../types/ProductTypes';
import { buildProductButtonStyle } from './ButtonSelector';

export const SelectPlanButton: FC<ProductButtonProps> = (props: ProductButtonProps) => {
    const { templateInteractions } = useLoggedInState();
    const { ask } = templateInteractions;
    const { subscriptionType, orgId, type, product, pageActionProps } = props;
    const router = useRouter();

    if (product === undefined) return null;

    return (
        <Button
            variant="contained"
            onClick={() => {
                if (subscriptionType === 'paid') {
                    ask(`Do you want to add ${product.name} to your subscription?`, () => {
                        pageActions.accountSubscribe(
                            pageActionProps,
                            orgId,
                            product.id,
                            type === 'tag'
                                ? AccountProduct.TAG_MANAGER
                                : AccountProduct.DATA_MANAGER,
                            () => {
                                router.push(buildThankYouPath(orgId, product.id, type)).then();
                            },
                        );
                    });
                } else {
                    pageActions.accountSubscribe(
                        pageActionProps,
                        orgId,
                        product.id,
                        type === 'tag' ? AccountProduct.TAG_MANAGER : AccountProduct.DATA_MANAGER,
                    );
                }
            }}
            sx={buildProductButtonStyle(type)}
            color="inherit"
            disableElevation
        >
            Select Plan
        </Button>
    );
};
