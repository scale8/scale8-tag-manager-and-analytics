import { FC } from 'react';
import { SelectPlanButton } from './SelectPlanButton';
import { SwitchPlanButton } from './SwitchPlanButton';
import { ProductButtonProps } from '../../../types/ProductTypes';
import { ContactButton } from './ContactButton';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { Button, darken } from '@mui/material';

export const buildProductButtonStyle = (type: 'tag' | 'data'): SxProps<Theme> => {
    return {
        color: '#ffffff',
        backgroundColor: (theme) =>
            type === 'tag'
                ? theme.palette.tagManagerColor.main
                : theme.palette.dataManagerColor.main,
        '&:hover': {
            backgroundColor: (theme) =>
                darken(
                    type === 'tag'
                        ? theme.palette.tagManagerColor.main
                        : theme.palette.dataManagerColor.main,
                    0.2,
                ),
        },
    };
};

export const ButtonSelector: FC<ProductButtonProps> = (props: ProductButtonProps) => {
    const { currentProductId, product } = props;
    if (product === undefined) {
        return <ContactButton {...props} />;
    }
    if (currentProductId === null || currentProductId === '') {
        return <SelectPlanButton {...props} />;
    }
    if (currentProductId !== product.id) {
        return <SwitchPlanButton {...props} />;
    }
    return (
        <Button variant="contained" disabled color="inherit" disableElevation>
            Current Plan
        </Button>
    );
};
