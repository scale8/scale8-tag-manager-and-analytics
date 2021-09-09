import { FC } from 'react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { SvgIconProps } from '@material-ui/core';

const LogoutIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <ExitToAppIcon {...props} />
        </>
    );
};

export default LogoutIcon;
