import { FC } from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

const DefaultIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props} viewBox="0 0 25 25">
            <path d="M12,20a7.43,7.43,0,0,1-5.3-2.2l.7-.7a6.5,6.5,0,1,0-1-8l-.86-.52A7.5,7.5,0,1,1,12,20Z" />
            <path d="M10.5,10H6a.5.5,0,0,1-.5-.5V5h1V9h4Z" />
            <circle cx="12.5" cy="12.5" r="1.5" />
        </SvgIcon>
    );
};

export default DefaultIcon;
