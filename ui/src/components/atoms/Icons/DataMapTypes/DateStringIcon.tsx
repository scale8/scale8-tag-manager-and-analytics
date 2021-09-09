import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import DateIcon from '../TypeIcons/DateIcon';

const DateStringIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <DateIcon {...props} />
        </>
    );
};

export default DateStringIcon;
