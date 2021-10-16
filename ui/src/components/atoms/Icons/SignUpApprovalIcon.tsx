import { FC } from 'react';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { SvgIconProps } from '@mui/material';

const SignUpApprovalIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <PlaylistAddCheckIcon {...props} />
        </>
    );
};

export default SignUpApprovalIcon;
