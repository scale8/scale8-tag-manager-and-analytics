import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import PaletteIcon from '@material-ui/icons/Palette';

const ColorIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <PaletteIcon {...props} />
        </>
    );
};

export default ColorIcon;
