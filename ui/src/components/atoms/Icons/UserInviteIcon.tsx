import { FC } from 'react';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import { SvgIconProps } from '@material-ui/core';

const UserInviteIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <HowToRegIcon {...props} />
        </>
    );
};

export default UserInviteIcon;
