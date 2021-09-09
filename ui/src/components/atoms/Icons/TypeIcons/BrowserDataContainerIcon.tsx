import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import WebAssetIcon from '@material-ui/icons/WebAsset';

const BrowserDataContainerIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <WebAssetIcon {...props} />
        </>
    );
};

export default BrowserDataContainerIcon;
