import { FC } from 'react';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import { SvgIconProps } from '@material-ui/core';

const PreviewSelectIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <MyLocationIcon {...props} />
        </>
    );
};

export default PreviewSelectIcon;
