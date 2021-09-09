import { FC } from 'react';
import DetailsIcon from '@material-ui/icons/Details';
import { SvgIconProps } from '@material-ui/core';

const EventIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <DetailsIcon {...props} />
        </>
    );
};

export default EventIcon;
