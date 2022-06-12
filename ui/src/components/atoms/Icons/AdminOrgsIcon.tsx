import { FC } from 'react';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { SvgIconProps } from '@mui/material';

const AdminOrgsIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CorporateFareIcon {...props} />
        </>
    );
};

export default AdminOrgsIcon;
