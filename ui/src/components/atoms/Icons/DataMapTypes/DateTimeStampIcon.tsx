import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import DateIcon from '../TypeIcons/DateIcon';

const DateTimeStampIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <DateIcon {...props} />
        </>
    );
};

export default DateTimeStampIcon;
