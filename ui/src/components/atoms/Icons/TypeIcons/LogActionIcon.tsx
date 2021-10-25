import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';

const LogActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <BugReportIcon {...props} />
        </>
    );
};

export default LogActionIcon;
