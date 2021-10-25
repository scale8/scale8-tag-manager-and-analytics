import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';

const ResetActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <RotateLeftIcon {...props} />
        </>
    );
};

export default ResetActionIcon;
