import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';

const ObjectIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <StopIcon {...props} />
        </>
    );
};

export default ObjectIcon;
