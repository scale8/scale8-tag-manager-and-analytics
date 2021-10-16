import { FC } from 'react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { SvgIconProps } from '@mui/material';

const ServiceProviderIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <AssignmentIcon {...props} />
        </>
    );
};

export default ServiceProviderIcon;
