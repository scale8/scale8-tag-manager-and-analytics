import { FC } from 'react';
import PersonIcon from '@material-ui/icons/Person';
import { SvgIconProps } from '@material-ui/core';

const ProfileIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <PersonIcon {...props} />
        </>
    );
};

export default ProfileIcon;
