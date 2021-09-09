import { FC } from 'react';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { SvgIconProps } from '@material-ui/core';

const RevisionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <AccountTreeIcon {...props} />
        </>
    );
};

export default RevisionIcon;
