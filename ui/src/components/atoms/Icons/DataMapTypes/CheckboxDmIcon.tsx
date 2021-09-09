import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import CheckboxTypeIcon from '../TypeIcons/CheckboxTypeIcon';

const CheckboxDmIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CheckboxTypeIcon {...props} />
        </>
    );
};

export default CheckboxDmIcon;
