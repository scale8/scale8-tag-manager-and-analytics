import { FC } from 'react';
import LayersIcon from '@material-ui/icons/Layers';
import { SvgIconProps } from '@material-ui/core';

const PlatformDataContainerIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <LayersIcon {...props} />
        </>
    );
};

export default PlatformDataContainerIcon;
