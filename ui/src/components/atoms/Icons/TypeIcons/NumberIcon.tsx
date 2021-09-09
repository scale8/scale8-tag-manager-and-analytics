import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import LooksOneIcon from '@material-ui/icons/LooksOne';

const NumberIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <LooksOneIcon {...props} />
        </>
    );
};

export default NumberIcon;
