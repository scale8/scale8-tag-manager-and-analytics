import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import ColorIcon from '../TypeIcons/ColorIcon';

const ColorDmIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <ColorIcon {...props} />
        </>
    );
};

export default ColorDmIcon;
