import { FC } from 'react';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { SvgIconProps } from '@material-ui/core';

const OrgUsersIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <SupervisorAccountIcon {...props} />
        </>
    );
};

export default OrgUsersIcon;
