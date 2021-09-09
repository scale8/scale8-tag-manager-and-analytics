import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';

const UserActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <FaceIcon {...props} />
        </>
    );
};

export default UserActionIcon;
