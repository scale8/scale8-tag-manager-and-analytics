import { FC } from 'react';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { Rule, Trigger } from '../../../types/TagRulesTypes';
import { ValuesRefreshFunction } from '../../../types/GqlTypes';
import { PageActionProps, pageActions } from '../../../actions/PageActions';
import { TagElementContainer } from '../../molecules/TagElementContainer';
import { moveDownId, moveUpId } from '../../../utils/ArrayUtils';
import RuleSection from '../../atoms/RuleSection';
import { toGlobalTrigger } from '../../../utils/NavigationPaths';
import Link from '../../atoms/Next/Link';
import { TriggerSection } from './TriggerSection';
import { ActionGroupDistributionPageSection } from './ActionGroupDistributionPageSection';
import { SectionAction } from '../../molecules/SectionActionsSpeedDial';
import { useConfigState } from '../../../context/AppContext';
import { SmallAddButton } from '../../atoms/SmallAddButton';

type RuleSectionProps = {
    tagId: string;
    rule: Rule;
    ruleIndex: number;
    rulesIds: string[];
    ruleGroupId: string;
    valuesRefresh: ValuesRefreshFunction;
    revisionLocked: boolean;
    pageActionProps: PageActionProps;
};

const RulePageSection: FC<RuleSectionProps> = (props: RuleSectionProps) => {
    const { tagId } = props;

    const {
        rule,
        ruleIndex,
        rulesIds,
        ruleGroupId,
        valuesRefresh,
        revisionLocked,
        pageActionProps,
    } = props;

    const { isAuditEnabled } = useConfigState();

    return (
        <TagElementContainer
            readonly={revisionLocked}
            key={rule.id}
            id={rule.id}
            title={rule.name}
            actions={[
                ...([
                    {
                        icon: <FileCopyIcon />,
                        name: 'Duplicate',
                        onClick: (id, event) => {
                            pageActions.duplicateRule(pageActionProps, id);
                            event.currentTarget.blur();
                        },
                    },
                    {
                        icon: <ArrowDownwardIcon />,
                        name: 'Move Down',
                        onClick: (id, event) => {
                            pageActions.updateRuleOrder(
                                pageActionProps,
                                ruleGroupId,
                                moveDownId(rulesIds, id),
                            );
                            event.currentTarget.blur();
                        },
                        disabled: ruleIndex === rulesIds.length - 1,
                    },
                    {
                        icon: <ArrowUpwardIcon />,
                        name: 'Move Up',
                        onClick: (id, event) => {
                            pageActions.updateRuleOrder(
                                pageActionProps,
                                ruleGroupId,
                                moveUpId(rulesIds, id),
                            );
                            event.currentTarget.blur();
                        },
                        disabled: ruleIndex === 0,
                    },
                    {
                        icon: <DeleteIcon />,
                        name: 'Delete',
                        onClick: (id, event) => {
                            pageActions.deleteRule(pageActionProps, id);
                            event.currentTarget.blur();
                        },
                    },
                    {
                        icon: <EditIcon />,
                        name: 'Edit',
                        onClick: (id, event) => {
                            pageActions.updateRule(pageActionProps, id);
                            event.currentTarget.blur();
                        },
                    },
                ] as SectionAction[]),
                ...((isAuditEnabled
                    ? [
                          {
                              icon: <HistoryIcon />,
                              name: 'History',
                              onClick: (id, event) => {
                                  pageActions.showRuleHistory(
                                      pageActionProps,
                                      id,
                                      rule.name,
                                      // rule.trigger.parent_type === 'REVISION'
                                      //     ? undefined
                                      //     : rule.trigger.id,
                                  );
                                  event.currentTarget.blur();
                              },
                          },
                      ]
                    : []) as SectionAction[]),
            ]}
        >
            <RuleSection main="If" secondary="the events, conditions and exceptions are all met">
                {rule.trigger.parent_type === 'REVISION' && (
                    <Box fontSize="15px" color="#888888" fontWeight="normal" paddingBottom={1}>
                        Global Trigger:{' '}
                        <Link href={toGlobalTrigger({ id: rule.trigger.id })}>
                            {rule.trigger.name}
                        </Link>
                    </Box>
                )}

                <Box
                    paddingLeft={rule.trigger.parent_type === 'REVISION' ? 2 : 0}
                    paddingTop={rule.trigger.parent_type === 'REVISION' ? 1 : 0}
                    marginBottom={rule.trigger.parent_type === 'REVISION' ? 3 : 0}
                    borderLeft={
                        rule.trigger.parent_type === 'REVISION'
                            ? '1px solid rgba(0, 0, 0, 0.12)'
                            : 'none'
                    }
                >
                    <TriggerSection
                        trigger={rule.trigger as Trigger}
                        readonly={revisionLocked || rule.trigger.parent_type === 'REVISION'}
                        pageActionProps={pageActionProps}
                    />
                </Box>
            </RuleSection>
            <RuleSection main="Then" secondary="perform the following">
                {rule.action_groups_distributions.map(
                    (actionGroupsDistribution, actionGroupsDistributionIndex) => (
                        <ActionGroupDistributionPageSection
                            valuesRefresh={valuesRefresh}
                            key={actionGroupsDistributionIndex}
                            actionGroupsDistribution={actionGroupsDistribution}
                            actionGroupsDistributionIndex={actionGroupsDistributionIndex}
                            actionGroupsDistributionsIds={rule.action_groups_distributions.map(
                                (actionGroupsDistribution) => actionGroupsDistribution.id,
                            )}
                            ruleId={rule.id}
                            readOnly={revisionLocked}
                            pageActionProps={pageActionProps}
                        />
                    ),
                )}
                <SmallAddButton
                    addButtonText="Add Action Group Distribution"
                    addButtonClick={() =>
                        pageActions.addActionGroupDistribution(pageActionProps, rule.id, tagId)
                    }
                    disabled={revisionLocked}
                />
            </RuleSection>
        </TagElementContainer>
    );
};

export { RulePageSection };
