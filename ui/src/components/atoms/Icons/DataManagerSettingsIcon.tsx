import { FC } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import { SvgIconProps } from '@material-ui/core';

const DataManagerSettingsIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <SettingsIcon {...props} />
        </>
    );
};

export default DataManagerSettingsIcon;
