import { FC, Fragment } from 'react';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import HistoryIcon from '@material-ui/icons/History';
import { Box } from '@material-ui/core';
import { RuleGroup } from '../../../types/TagRulesTypes';
import { ValuesRefreshFunction } from '../../../types/GqlTypes';
import { PageActionProps, pageActions } from '../../../actions/PageActions';
import { TagElementContainer } from '../../molecules/TagElementContainer';
import { moveDownId, moveUpId } from '../../../utils/ArrayUtils';
import RuleContainerDivider from '../../atoms/RuleContainerDivider';
import { RulePageSection } from './RulePageSection';
import RulesAddButton from '../../atoms/RulesAddButton';
import { SectionAction } from '../../molecules/SectionActionsSpeedDial';
import { useConfigState } from '../../../context/AppContext';

type RuleGroupSectionProps = {
    ruleGroup: RuleGroup;
    ruleGroupIndex: number;
    ruleGroupsIds: string[];
    tagId: string;
    valuesRefresh: ValuesRefreshFunction;
    revisionLocked: boolean;
    pageActionProps: PageActionProps;
};

const RuleGroupPageSection: FC<RuleGroupSectionProps> = (props: RuleGroupSectionProps) => {
    const {
        ruleGroup,
        ruleGroupIndex,
        ruleGroupsIds,
        tagId,
        valuesRefresh,
        revisionLocked,
        pageActionProps,
    } = props;

    const { isAuditEnabled } = useConfigState();

    return (
        <TagElementContainer
            dark
            readonly={revisionLocked}
            id={ruleGroup.id}
            title={ruleGroup.name}
            actions={[
                ...([
                    {
                        icon: <FileCopyIcon />,
                        name: 'Duplicate',
                        onClick: (id, event) => {
                            pageActions.duplicateRuleGroup(pageActionProps, id);
                            event.currentTarget.blur();
                        },
                    },
                    {
                        icon: <ArrowDownwardIcon />,
                        name: 'Move Down',
                        onClick: (id, event) => {
                            pageActions.updateRuleGroupOrder(
                                pageActionProps,
                                tagId,
                                moveDownId(ruleGroupsIds, id),
                            );
                            event.currentTarget.blur();
                        },
                        disabled: ruleGroupIndex === ruleGroupsIds.length - 1,
                    },
                    {
                        icon: <ArrowUpwardIcon />,
                        name: 'Move Up',
                        onClick: (id, event) => {
                            pageActions.updateRuleGroupOrder(
                                pageActionProps,
                                tagId,
                                moveUpId(ruleGroupsIds, id),
                            );
                            event.currentTarget.blur();
                        },
                        disabled: ruleGroupIndex === 0,
                    },
                    {
                        icon: <DeleteIcon />,
                        name: 'Delete',
                        onClick: (id, event) => {
                            pageActions.deleteRuleGroup(pageActionProps, id);
                            event.currentTarget.blur();
                        },
                    },
                    {
                        icon: <EditIcon />,
                        name: 'Edit',
                        onClick: (id, event) => {
                            pageActions.updateRuleGroup(pageActionProps, id);
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
                                  pageActions.showRuleGroupHistory(
                                      pageActionProps,
                                      id,
                                      ruleGroup.name,
                                  );
                                  event.currentTarget.blur();
                              },
                          },
                      ]
                    : []) as SectionAction[]),
            ]}
        >
            <Box component="div" fontSize="15px" mb={3} color="#888888" fontWeight="normal">
                Only the first matching rule within this group will be executed.
            </Box>
            {ruleGroup.rules.map((rule, ruleIndex) => (
                <Fragment key={rule.id}>
                    {ruleIndex !== 0 && <RuleContainerDivider text="Or" dark />}
                    <RulePageSection
                        tagId={tagId}
                        rule={rule}
                        ruleIndex={ruleIndex}
                        rulesIds={ruleGroup.rules.map((rule) => rule.id)}
                        ruleGroupId={ruleGroup.id}
                        valuesRefresh={valuesRefresh}
                        revisionLocked={revisionLocked}
                        pageActionProps={pageActionProps}
                    />
                </Fragment>
            ))}
            <RulesAddButton
                text="Add Rule"
                onClick={() => pageActions.createRule(pageActionProps, ruleGroup.id, tagId)}
                disabled={revisionLocked}
            />
        </TagElementContainer>
    );
};

export { RuleGroupPageSection };
