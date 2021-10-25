import { FC } from 'react';
import StorageIcon from '@mui/icons-material/Storage';
import { SvgIconProps } from '@mui/material';

const DefaultDataContainerIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <StorageIcon {...props} />
        </>
    );
};

export default DefaultDataContainerIcon;
