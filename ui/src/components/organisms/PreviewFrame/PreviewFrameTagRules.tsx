import { FC, Fragment } from 'react';
import { Box, Typography } from '@material-ui/core';
import { PreviewFrameData_getRevision_tags } from '../../../gql/generated/PreviewFrameData';
import RuleContainerDivider from '../../atoms/RuleContainerDivider';
import { PreviewFrameTagRuleGroup } from './PreviewFrameTagRuleGroup';
import { RuleGroupStatus, TagStatus } from '../../../types/PreviewFrameTypes';

type PreviewFrameTagRulesProps = {
    tagStatus: TagStatus;
    tagData: PreviewFrameData_getRevision_tags;
};

const PreviewFrameTagRules: FC<PreviewFrameTagRulesProps> = (props: PreviewFrameTagRulesProps) => {
    const { tagStatus, tagData } = props;

    const getRuleGroupStatus: (ruleGroupId: string) => RuleGroupStatus = (ruleGroupId: string) => {
        const status: RuleGroupStatus | undefined = tagStatus.ruleGroups.find(
            (_) => _.ruleGroupId === ruleGroupId,
        );

        if (status === undefined) {
            return {
                ruleGroupId,
                applied: false,
                rules: [],
            };
        }

        return status;
    };

    return (
        <Box p={1}>
            {tagData.rule_groups.length === 0 && <Typography>No rule group defined.</Typography>}
            {tagData.rule_groups.map((ruleGroup, ruleGroupIndex) => (
                <Fragment key={ruleGroup.id}>
                    {ruleGroupIndex !== 0 && <RuleContainerDivider text="And" />}
                    <PreviewFrameTagRuleGroup
                        ruleGroupData={ruleGroup}
                        ruleGroupStatus={getRuleGroupStatus(ruleGroup.id)}
                    />
                </Fragment>
            ))}
        </Box>
    );
};

export { PreviewFrameTagRules };
