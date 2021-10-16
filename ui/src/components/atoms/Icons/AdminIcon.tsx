import { FC } from 'react';
import BuildIcon from '@mui/icons-material/Build';
import { SvgIconProps } from '@mui/material';

const AdminIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <BuildIcon {...props} />
        </>
    );
};

export default AdminIcon;
