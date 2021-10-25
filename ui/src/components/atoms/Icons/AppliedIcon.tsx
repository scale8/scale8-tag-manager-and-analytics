import { FC } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { SvgIconProps, Tooltip } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

type AppliedIconProps = {
    iconProps?: SvgIconProps;
    applied: boolean;
    ruleGroupCompleted: boolean;
    error?: boolean;
    verb: string;
};

const AppliedIcon: FC<AppliedIconProps> = (props: AppliedIconProps) => {
    const { iconProps, ruleGroupCompleted, applied, verb, error } = props;
    if (error) {
        return (
            <Tooltip title={verb}>
                <WarningIcon sx={{ color: (theme) => theme.palette.error.main }} {...iconProps} />
            </Tooltip>
        );
    }

    if (applied) {
        return (
            <Tooltip title={verb}>
                <CheckCircleOutlineIcon
                    sx={{ color: (theme) => theme.palette.success.main }}
                    {...iconProps}
                />
            </Tooltip>
        );
    }

    if (!ruleGroupCompleted) {
        return (
            <Tooltip title="Pending">
                <HourglassEmptyIcon sx={{ color: '#888888' }} {...iconProps} />
            </Tooltip>
        );
    }

    return (
        <Tooltip title={`Not ${verb}`}>
            <HighlightOffIcon sx={{ color: '#888888' }} {...iconProps} />
        </Tooltip>
    );
};

export default AppliedIcon;
