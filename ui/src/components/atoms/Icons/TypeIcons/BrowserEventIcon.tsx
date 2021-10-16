import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import WebAssetIcon from '@mui/icons-material/WebAsset';

const BrowserEventIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <WebAssetIcon {...props} />
        </>
    );
};

export default BrowserEventIcon;
