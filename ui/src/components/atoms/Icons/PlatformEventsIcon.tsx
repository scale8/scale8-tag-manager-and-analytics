import { FC } from 'react';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { SvgIconProps } from '@material-ui/core';

const PlatformEventsIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <AccountTreeIcon {...props} />
        </>
    );
};

export default PlatformEventsIcon;
