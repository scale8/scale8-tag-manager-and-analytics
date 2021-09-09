import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import ColorIcon from '../TypeIcons/ColorIcon';

const ColorDmIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <ColorIcon {...props} />
        </>
    );
};

export default ColorDmIcon;
