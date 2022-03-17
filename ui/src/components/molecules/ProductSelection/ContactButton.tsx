import { FC } from 'react';
import { Button } from '@mui/material';
import { ProductButtonProps } from '../../../types/ProductTypes';
import { buildProductButtonStyle } from './ButtonSelector';

export const ContactButton: FC<ProductButtonProps> = (props: ProductButtonProps) => {
    return (
        <Button
            variant="contained"
            href="https://www.linkedin.com/company/19143089/admin/"
            target="_new"
            sx={buildProductButtonStyle(props.type)}
            color="inherit"
            disableElevation
        >
            Contact Us
        </Button>
    );
};
