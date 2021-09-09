import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

const PullActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CloudDownloadIcon {...props} />
        </>
    );
};

export default PullActionIcon;
