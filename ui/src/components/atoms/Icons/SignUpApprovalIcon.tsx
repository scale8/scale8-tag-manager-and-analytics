import { FC } from 'react';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import { SvgIconProps } from '@material-ui/core';

const SignUpApprovalIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <PlaylistAddCheckIcon {...props} />
        </>
    );
};

export default SignUpApprovalIcon;
