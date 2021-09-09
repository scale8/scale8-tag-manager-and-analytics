import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import DateIcon from '../TypeIcons/DateIcon';

const DateStampIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <DateIcon {...props} />
        </>
    );
};

export default DateStampIcon;
