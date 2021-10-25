import { FC } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { SvgIconProps } from '@mui/material';

const ProfileIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <PersonIcon {...props} />
        </>
    );
};

export default ProfileIcon;
