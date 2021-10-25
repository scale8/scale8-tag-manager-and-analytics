import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';

const DateIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <TodayIcon {...props} />
        </>
    );
};

export default DateIcon;
