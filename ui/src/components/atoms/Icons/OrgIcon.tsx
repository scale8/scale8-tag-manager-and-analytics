import { FC } from 'react';
import BusinessIcon from '@material-ui/icons/Business';
import { SvgIconProps } from '@material-ui/core';

const OrgIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <BusinessIcon {...props} />
        </>
    );
};

export default OrgIcon;
