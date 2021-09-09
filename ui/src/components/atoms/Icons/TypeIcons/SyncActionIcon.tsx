import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import SyncAltIcon from '@material-ui/icons/SyncAlt';

const SyncActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <SyncAltIcon {...props} />
        </>
    );
};

export default SyncActionIcon;
