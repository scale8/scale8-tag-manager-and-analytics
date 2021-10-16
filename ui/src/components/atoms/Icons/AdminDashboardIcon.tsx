import { FC } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { SvgIconProps } from '@mui/material';

const AdminDashboardIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <DashboardIcon {...props} />
        </>
    );
};

export default AdminDashboardIcon;
