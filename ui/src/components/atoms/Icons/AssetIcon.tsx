import { FC } from 'react';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import { SvgIconProps } from '@mui/material';

const AssetIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <WebAssetIcon {...props} />
        </>
    );
};

export default AssetIcon;
