import { FC } from 'react';
import WebIcon from '@material-ui/icons/Web';
import { SvgIconProps } from '@material-ui/core';

const AppIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <WebIcon {...props} />
        </>
    );
};

export default AppIcon;
