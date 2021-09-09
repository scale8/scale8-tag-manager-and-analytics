import { FC } from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { SvgIconProps } from '@material-ui/core';

const OrgDashboardIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <DashboardIcon {...props} />
        </>
    );
};

export default OrgDashboardIcon;
