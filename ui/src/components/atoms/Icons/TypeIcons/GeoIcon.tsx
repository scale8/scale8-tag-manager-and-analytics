import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';

const GeoIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <PublicIcon {...props} />
        </>
    );
};

export default GeoIcon;
