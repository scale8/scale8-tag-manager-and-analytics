import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

const ResetActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <RotateLeftIcon {...props} />
        </>
    );
};

export default ResetActionIcon;
