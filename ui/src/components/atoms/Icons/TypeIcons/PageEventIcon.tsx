import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import WebIcon from '@mui/icons-material/Web';

const PageEventIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <WebIcon {...props} />
        </>
    );
};

export default PageEventIcon;
