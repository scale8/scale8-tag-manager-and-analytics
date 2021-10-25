import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import RadioIcon from '../TypeIcons/RadioIcon';

const BooleanIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <RadioIcon {...props} />
        </>
    );
};

export default BooleanIcon;
