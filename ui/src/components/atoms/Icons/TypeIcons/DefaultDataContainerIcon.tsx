import { FC } from 'react';
import StorageIcon from '@material-ui/icons/Storage';
import { SvgIconProps } from '@material-ui/core';

const DefaultDataContainerIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <StorageIcon {...props} />
        </>
    );
};

export default DefaultDataContainerIcon;
