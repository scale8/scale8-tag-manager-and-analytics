import { FC } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { SvgIconProps } from '@mui/material';

const SettingIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <SettingsIcon {...props} />
        </>
    );
};

export default SettingIcon;
