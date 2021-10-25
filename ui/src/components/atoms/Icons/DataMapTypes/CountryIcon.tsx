import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import GeoIcon from '../TypeIcons/GeoIcon';

const CountryIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <GeoIcon {...props} />
        </>
    );
};

export default CountryIcon;
