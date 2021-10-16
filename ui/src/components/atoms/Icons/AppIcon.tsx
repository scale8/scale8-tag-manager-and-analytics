import { FC } from 'react';
import WebIcon from '@mui/icons-material/Web';
import { SvgIconProps } from '@mui/material';

const AppIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <WebIcon {...props} />
        </>
    );
};

export default AppIcon;
