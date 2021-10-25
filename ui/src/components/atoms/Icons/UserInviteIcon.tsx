import { FC } from 'react';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { SvgIconProps } from '@mui/material';

const UserInviteIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <HowToRegIcon {...props} />
        </>
    );
};

export default UserInviteIcon;
