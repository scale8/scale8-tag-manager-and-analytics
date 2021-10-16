import { FC } from 'react';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { SvgIconProps } from '@mui/material';

const OrgUsersIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <SupervisorAccountIcon {...props} />
        </>
    );
};

export default OrgUsersIcon;
