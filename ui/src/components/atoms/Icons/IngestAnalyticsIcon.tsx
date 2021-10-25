import { FC } from 'react';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { SvgIconProps } from '@mui/material';

const IngestAnalyticsIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <AssessmentIcon {...props} />
        </>
    );
};

export default IngestAnalyticsIcon;
