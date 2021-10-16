import { FC } from 'react';
import TableChartIcon from '@mui/icons-material/TableChart';
import { SvgIconProps } from '@mui/material';

const DataMapIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <TableChartIcon {...props} />
        </>
    );
};

export default DataMapIcon;
