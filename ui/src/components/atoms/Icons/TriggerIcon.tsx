import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import CallMadeIcon from '@mui/icons-material/CallMade';

const TriggerIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <CallMadeIcon {...props} />
        </>
    );
};

export default TriggerIcon;
