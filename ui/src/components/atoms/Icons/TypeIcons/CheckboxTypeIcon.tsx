import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const CheckboxTypeIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CheckBoxIcon {...props} />
        </>
    );
};

export default CheckboxTypeIcon;
