import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import StorageIcon from '@material-ui/icons/Storage';

const DataActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <StorageIcon {...props} />
        </>
    );
};

export default DataActionIcon;
