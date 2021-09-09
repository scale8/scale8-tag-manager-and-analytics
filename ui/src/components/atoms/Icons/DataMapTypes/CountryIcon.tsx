import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import GeoIcon from '../TypeIcons/GeoIcon';

const CountryIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <GeoIcon {...props} />
        </>
    );
};

export default CountryIcon;
