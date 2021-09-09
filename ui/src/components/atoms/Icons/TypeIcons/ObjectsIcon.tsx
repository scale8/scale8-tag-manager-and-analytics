import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';

const ObjectsIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <AppsIcon {...props} />
        </>
    );
};

export default ObjectsIcon;
