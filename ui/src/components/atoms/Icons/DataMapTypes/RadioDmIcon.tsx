import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import RadioIcon from '../TypeIcons/RadioIcon';

const RadioDmIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <RadioIcon {...props} />
        </>
    );
};

export default RadioDmIcon;
