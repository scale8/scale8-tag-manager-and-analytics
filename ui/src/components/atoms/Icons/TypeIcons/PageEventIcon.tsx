import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import WebIcon from '@material-ui/icons/Web';

const PageEventIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <WebIcon {...props} />
        </>
    );
};

export default PageEventIcon;
