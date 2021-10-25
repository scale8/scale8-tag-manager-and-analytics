import { FC } from 'react';
import LayersIcon from '@mui/icons-material/Layers';
import { SvgIconProps } from '@mui/material';

const PlatformIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <LayersIcon {...props} />
        </>
    );
};

export default PlatformIcon;
