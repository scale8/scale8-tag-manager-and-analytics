import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import StopIcon from '@material-ui/icons/Stop';

const ObjectIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <StopIcon {...props} />
        </>
    );
};

export default ObjectIcon;
