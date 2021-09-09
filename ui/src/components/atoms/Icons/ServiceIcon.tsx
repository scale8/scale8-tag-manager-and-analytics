import { FC } from 'react';
import ExtensionIcon from '@material-ui/icons/Extension';
import { SvgIconProps } from '@material-ui/core';

const ServiceIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <ExtensionIcon {...props} />
        </>
    );
};

export default ServiceIcon;
