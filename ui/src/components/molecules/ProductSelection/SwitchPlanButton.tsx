import { FC } from 'react';
import { useLoggedInState } from '../../../context/AppContext';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { pageActions } from '../../../actions/PageActions';
import { buildThankYouPath } from '../../../utils/NavigationPaths';
import { ProductButtonProps } from '../../../types/ProductTypes';
import { buildProductButtonStyle } from './ButtonSelector';
import { AccountProduct } from '../../../gql/generated/globalTypes';

export const SwitchPlanButton: FC<ProductButtonProps> = (props: ProductButtonProps) => {
    const { templateInteractions } = useLoggedInState();
    const { ask } = templateInteractions;
    const { type, orgId, product, pageActionProps } = props;
    const router = useRouter();

    if (product === undefined) return null;

    return (
        <Button
            variant="contained"
            onClick={() => {
                ask(`Do you want to switch to ${product.name}?`, () => {
                    pageActions.accountSubscribe(
                        pageActionProps,
                        orgId,
                        product.id,
                        type === 'tag' ? AccountProduct.TAG_MANAGER : AccountProduct.DATA_MANAGER,
                        () => {
                            router.push(buildThankYouPath(orgId, product.id, type)).then();
                        },
                    );
                });
            }}
            sx={buildProductButtonStyle(type)}
            color="inherit"
            disableElevation
        >
            Switch to this Plan
        </Button>
    );
};
