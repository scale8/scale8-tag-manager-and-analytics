import { FC } from 'react';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { SvgIconProps } from '@material-ui/core';

const ServiceProviderIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <AssignmentIcon {...props} />
        </>
    );
};

export default ServiceProviderIcon;
