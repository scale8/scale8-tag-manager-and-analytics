import { FC } from 'react';
import CropLandscapeIcon from '@mui/icons-material/CropLandscape';
import { SvgIconProps } from '@mui/material';

const DefaultIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CropLandscapeIcon {...props} />
        </>
    );
};

export default DefaultIcon;
