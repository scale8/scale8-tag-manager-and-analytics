import { FC } from 'react';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { SvgIconProps } from '@material-ui/core';

const IngestAnalyticsIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <AssessmentIcon {...props} />
        </>
    );
};

export default IngestAnalyticsIcon;
