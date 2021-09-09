import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import NumberIcon from '../TypeIcons/NumberIcon';

const IntArrayIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <NumberIcon {...props} />
        </>
    );
};

export default IntArrayIcon;
