import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';

const DataActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <StorageIcon {...props} />
        </>
    );
};

export default DataActionIcon;
