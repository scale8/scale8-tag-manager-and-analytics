import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import RadioIcon from '../TypeIcons/RadioIcon';

const RadioDmIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <RadioIcon {...props} />
        </>
    );
};

export default RadioDmIcon;
