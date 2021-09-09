import { FC } from 'react';
import BuildIcon from '@material-ui/icons/Build';
import { SvgIconProps } from '@material-ui/core';

const AdminIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <BuildIcon {...props} />
        </>
    );
};

export default AdminIcon;
