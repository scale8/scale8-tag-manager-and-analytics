import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const CheckboxTypeIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CheckBoxIcon {...props} />
        </>
    );
};

export default CheckboxTypeIcon;
