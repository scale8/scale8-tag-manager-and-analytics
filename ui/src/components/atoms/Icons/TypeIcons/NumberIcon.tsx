import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import LooksOneIcon from '@mui/icons-material/LooksOne';

const NumberIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <LooksOneIcon {...props} />
        </>
    );
};

export default NumberIcon;
