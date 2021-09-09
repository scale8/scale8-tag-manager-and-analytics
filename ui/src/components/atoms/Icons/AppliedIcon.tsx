import { FC } from 'react';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import { SvgIconProps, Tooltip, useTheme } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';

type AppliedIconProps = {
    iconProps?: SvgIconProps;
    applied: boolean;
    ruleGroupCompleted: boolean;
    error?: boolean;
    verb: string;
};

const AppliedIcon: FC<AppliedIconProps> = (props: AppliedIconProps) => {
    const theme = useTheme();

    const { iconProps, ruleGroupCompleted, applied, verb, error } = props;
    if (error) {
        return (
            <Tooltip title={verb}>
                <WarningIcon style={{ color: theme.palette.error.main }} {...iconProps} />
            </Tooltip>
        );
    }

    if (applied) {
        return (
            <Tooltip title={verb}>
                <CheckCircleOutlineIcon
                    style={{ color: theme.palette.success.main }}
                    {...iconProps}
                />
            </Tooltip>
        );
    }

    if (!ruleGroupCompleted) {
        return (
            <Tooltip title="Pending">
                <HourglassEmptyIcon style={{ color: '#888888' }} {...iconProps} />
            </Tooltip>
        );
    }

    return (
        <Tooltip title={`Not ${verb}`}>
            <HighlightOffIcon style={{ color: '#888888' }} {...iconProps} />
        </Tooltip>
    );
};

export default AppliedIcon;
