import { FC, Fragment } from 'react';
import { Box, Typography } from '@mui/material';
import { TagElementContainer } from '../../molecules/TagElementContainer';
import { PreviewFrameData_getRevision_tags_rule_groups } from '../../../gql/generated/PreviewFrameData';
import RuleContainerDivider from '../../atoms/RuleContainerDivider';
import { PreviewFrameTagRule } from './PreviewFrameTagRule';
import { RuleGroupStatus } from '../../../types/PreviewFrameTypes';

type PreviewFrameTagRuleGroupProps = {
    ruleGroupStatus: RuleGroupStatus;
    ruleGroupData: PreviewFrameData_getRevision_tags_rule_groups;
};

const PreviewFrameTagRuleGroup: FC<PreviewFrameTagRuleGroupProps> = (
    props: PreviewFrameTagRuleGroupProps,
) => {
    const { ruleGroupStatus, ruleGroupData } = props;

    return (
        <TagElementContainer
            dark
            readonly={true}
            applied={ruleGroupStatus.applied}
            id={ruleGroupData.id}
            title={ruleGroupData.name}
            actions={[]}
        >
            <Box component="div" fontSize="15px" mb={3} color="#888888" fontWeight="normal">
                Only the first matching rule within this group will be executed.
            </Box>
            {ruleGroupData.rules.length === 0 && <Typography>No rule defined.</Typography>}
            {ruleGroupData.rules.map((rule, ruleIndex) => (
                <Fragment key={rule.id}>
                    {ruleIndex !== 0 && <RuleContainerDivider text="Or" dark />}
                    <PreviewFrameTagRule
                        ruleData={rule}
                        ruleStatuses={ruleGroupStatus.rules.filter((_) => _.ruleId === rule.id)}
                        ruleGroupCompleted={ruleGroupStatus.applied}
                    />
                </Fragment>
            ))}
        </TagElementContainer>
    );
};

export { PreviewFrameTagRuleGroup };
