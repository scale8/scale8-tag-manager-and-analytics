import { FC } from 'react';
import ExtensionIcon from '@mui/icons-material/Extension';
import { SvgIconProps } from '@mui/material';

const ServiceIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <ExtensionIcon {...props} />
        </>
    );
};

export default ServiceIcon;
