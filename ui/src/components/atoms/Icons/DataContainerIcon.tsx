import { FC } from 'react';
import StorageIcon from '@mui/icons-material/Storage';
import { SvgIconProps } from '@mui/material';

const DataContainerIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <StorageIcon {...props} />
        </>
    );
};

export default DataContainerIcon;
