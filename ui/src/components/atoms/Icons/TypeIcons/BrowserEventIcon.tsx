import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import WebAssetIcon from '@material-ui/icons/WebAsset';

const BrowserEventIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <WebAssetIcon {...props} />
        </>
    );
};

export default BrowserEventIcon;
