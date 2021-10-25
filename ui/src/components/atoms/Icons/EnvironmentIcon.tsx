import { FC } from 'react';
import DnsIcon from '@mui/icons-material/Dns';
import { SvgIconProps } from '@mui/material';

const EnvironmentIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <DnsIcon {...props} />
        </>
    );
};

export default EnvironmentIcon;
