import { FC } from 'react';
import { ProductListButtonProps } from '../../../dialogPages/global/orgSettings/ProductList';
import { SelectPlanButton } from './SelectPlanButton';
import { CurrentButton } from './CurrentButton';
import { SwitchPlanButton } from './SwitchPlanButton';

export const ButtonSelector: FC<ProductListButtonProps> = (props: ProductListButtonProps) => {
    const { currentProductId, product } = props;
    if (currentProductId === null) {
        return <SelectPlanButton {...props} />;
    }
    if (currentProductId === product.id) {
        return <CurrentButton />;
    }
    return <SwitchPlanButton {...props} />;
};
