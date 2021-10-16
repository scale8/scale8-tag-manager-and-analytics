import { FC } from 'react';
import SyncIcon from '@mui/icons-material/Sync';
import { SvgIconProps } from '@mui/material';

const PreviewRefreshIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <SyncIcon {...props} />
        </>
    );
};

export default PreviewRefreshIcon;
