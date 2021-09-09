import { FC } from 'react';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import { SvgIconProps } from '@material-ui/core';

const AssetIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <WebAssetIcon {...props} />
        </>
    );
};

export default AssetIcon;
