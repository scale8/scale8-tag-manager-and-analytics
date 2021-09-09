import { FC } from 'react';
import CropLandscapeIcon from '@material-ui/icons/CropLandscape';
import { SvgIconProps } from '@material-ui/core';

const DefaultIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CropLandscapeIcon {...props} />
        </>
    );
};

export default DefaultIcon;
