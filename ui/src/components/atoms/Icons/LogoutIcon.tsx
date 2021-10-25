import { FC } from 'react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { SvgIconProps } from '@mui/material';

const LogoutIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <ExitToAppIcon {...props} />
        </>
    );
};

export default LogoutIcon;
