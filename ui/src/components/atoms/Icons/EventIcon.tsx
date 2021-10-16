import { FC } from 'react';
import DetailsIcon from '@mui/icons-material/Details';
import { SvgIconProps } from '@mui/material';

const EventIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <DetailsIcon {...props} />
        </>
    );
};

export default EventIcon;
