import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import TodayIcon from '@material-ui/icons/Today';

const DateIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <TodayIcon {...props} />
        </>
    );
};

export default DateIcon;
