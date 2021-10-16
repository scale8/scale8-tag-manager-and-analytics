import { FC } from 'react';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { SvgIconProps } from '@mui/material';

const PreviewSelectIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <MyLocationIcon {...props} />
        </>
    );
};

export default PreviewSelectIcon;
