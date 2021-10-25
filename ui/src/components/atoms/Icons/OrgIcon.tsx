import { FC } from 'react';
import BusinessIcon from '@mui/icons-material/Business';
import { SvgIconProps } from '@mui/material';

const OrgIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <BusinessIcon {...props} />
        </>
    );
};

export default OrgIcon;
