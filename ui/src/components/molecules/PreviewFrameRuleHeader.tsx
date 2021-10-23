import { Dispatch, FC, SetStateAction } from 'react';
import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import AppliedIcon from '../atoms/Icons/AppliedIcon';
import { timestampDisplay } from '../../utils/DateTimeUtils';
import { RuleStatus } from '../../types/PreviewFrameTypes';

export type PreviewFrameRuleHeaderProps = {
    ruleIndex: number;
    ruleName: string;
    setRuleIndex: Dispatch<SetStateAction<number>>;
    ruleStatuses: RuleStatus[];
    ruleStatus?: RuleStatus;
    noNumber?: boolean;
    ruleGroupCompleted: boolean;
};

const PreviewFrameRuleHeaderEntry: FC<PreviewFrameRuleHeaderProps> = (
    props: PreviewFrameRuleHeaderProps,
) => {
    const { ruleStatus, ruleName, ruleGroupCompleted, noNumber } = props;

    if (ruleStatus === undefined) return null;

    return (
        <Box display="flex" alignItems="center">
            <AppliedIcon
                applied={ruleStatus.applied}
                verb="Applied"
                ruleGroupCompleted={ruleGroupCompleted}
                error={ruleStatus.hasErrors}
            />
            <Box pl="10px" fontSize="18px">
                {ruleName} - {timestampDisplay(ruleStatus.ts)}{' '}
                {noNumber === true ? '' : `(${ruleStatus.index})`}
            </Box>
        </Box>
    );
};

const PreviewFrameRuleHeader: FC<PreviewFrameRuleHeaderProps> = (
    props: PreviewFrameRuleHeaderProps,
) => {
    const { ruleIndex, setRuleIndex, ruleStatuses } = props;

    if (ruleStatuses.length === 1) {
        return (
            <Box display="flex" alignItems="center" height="56px" py={1}>
                <PreviewFrameRuleHeaderEntry {...props} ruleStatus={ruleStatuses[0]} noNumber />
            </Box>
        );
    } else {
        return (
            <Box>
                <Box display="flex" alignItems="center" height="56px" py={1}>
                    <Select
                        sx={{ width: '100%' }}
                        value={ruleIndex.toString()}
                        onChange={(event: SelectChangeEvent) =>
                            setRuleIndex(parseInt(event.target.value as string))
                        }
                        name="rule-run"
                    >
                        {ruleStatuses.map((value, key) => (
                            <MenuItem key={key} value={value.index.toString()}>
                                <PreviewFrameRuleHeaderEntry {...props} ruleStatus={value} />
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>
        );
    }
};

export default PreviewFrameRuleHeader;
