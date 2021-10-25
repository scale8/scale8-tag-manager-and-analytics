import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const PullActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CloudDownloadIcon {...props} />
        </>
    );
};

export default PullActionIcon;
