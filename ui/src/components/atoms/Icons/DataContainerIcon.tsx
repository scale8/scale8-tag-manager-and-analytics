import { FC } from 'react';
import StorageIcon from '@material-ui/icons/Storage';
import { SvgIconProps } from '@material-ui/core';

const DataContainerIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <StorageIcon {...props} />
        </>
    );
};

export default DataContainerIcon;
