import { FC } from 'react';
import DetailsIcon from '@mui/icons-material/Details';
import { SvgIconProps } from '@mui/material';

const DefaultEventIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <DetailsIcon {...props} />
        </>
    );
};

export default DefaultEventIcon;
