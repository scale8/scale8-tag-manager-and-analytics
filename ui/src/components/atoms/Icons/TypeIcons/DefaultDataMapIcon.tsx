import { FC } from 'react';
import TableChartIcon from '@material-ui/icons/TableChart';
import { SvgIconProps } from '@material-ui/core';

const DefaultDataMapIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <TableChartIcon {...props} />
        </>
    );
};

export default DefaultDataMapIcon;
