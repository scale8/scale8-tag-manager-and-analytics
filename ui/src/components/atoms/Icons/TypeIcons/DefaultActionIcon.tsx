import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';

const DefaultActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CenterFocusWeakIcon {...props} />
        </>
    );
};

export default DefaultActionIcon;
