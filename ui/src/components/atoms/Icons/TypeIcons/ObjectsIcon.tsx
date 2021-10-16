import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';

const ObjectsIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <AppsIcon {...props} />
        </>
    );
};

export default ObjectsIcon;
