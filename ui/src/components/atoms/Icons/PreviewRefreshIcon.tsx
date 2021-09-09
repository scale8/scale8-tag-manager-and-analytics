import { FC } from 'react';
import SyncIcon from '@material-ui/icons/Sync';
import { SvgIconProps } from '@material-ui/core';

const PreviewRefreshIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <SyncIcon {...props} />
        </>
    );
};

export default PreviewRefreshIcon;
