import { FC } from 'react';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { SvgIconProps } from '@mui/material';

const RevisionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <AccountTreeIcon {...props} />
        </>
    );
};

export default RevisionIcon;
