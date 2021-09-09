import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import PublicIcon from '@material-ui/icons/Public';

const GeoIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <PublicIcon {...props} />
        </>
    );
};

export default GeoIcon;
