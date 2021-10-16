import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import SyncAltIcon from '@mui/icons-material/SyncAlt';

const SyncActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <SyncAltIcon {...props} />
        </>
    );
};

export default SyncActionIcon;
