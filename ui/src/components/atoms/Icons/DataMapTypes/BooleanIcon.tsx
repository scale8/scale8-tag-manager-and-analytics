import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import RadioIcon from '../TypeIcons/RadioIcon';

const BooleanIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <RadioIcon {...props} />
        </>
    );
};

export default BooleanIcon;
