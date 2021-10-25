import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';

const UserActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <FaceIcon {...props} />
        </>
    );
};

export default UserActionIcon;
