import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';

const ColorIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <PaletteIcon {...props} />
        </>
    );
};

export default ColorIcon;
