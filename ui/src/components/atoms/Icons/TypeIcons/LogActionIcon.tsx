import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core';
import BugReportIcon from '@material-ui/icons/BugReport';

const LogActionIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <BugReportIcon {...props} />
        </>
    );
};

export default LogActionIcon;
