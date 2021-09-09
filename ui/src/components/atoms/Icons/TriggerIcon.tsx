import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import CallMadeIcon from '@material-ui/icons/CallMade';

const TriggerIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CallMadeIcon {...props} />
        </>
    );
};

export default TriggerIcon;
