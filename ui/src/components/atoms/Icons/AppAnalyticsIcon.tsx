import { FC } from 'react';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { SvgIconProps } from '@mui/material';

const AppAnalyticsIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <AssessmentIcon {...props} />
        </>
    );
};

export default AppAnalyticsIcon;
