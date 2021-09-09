import { FC } from 'react';
import DnsIcon from '@material-ui/icons/Dns';
import { SvgIconProps } from '@material-ui/core';

const EnvironmentIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <DnsIcon {...props} />
        </>
    );
};

export default EnvironmentIcon;
