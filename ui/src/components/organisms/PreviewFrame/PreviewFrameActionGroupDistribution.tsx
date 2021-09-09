import { FC, useContext } from 'react';
import { PreviewFrameData_getRevision_tags_rule_groups_rules_action_groups_distributions } from '../../../gql/generated/PreviewFrameData';
import { InnerTagElementContainer } from '../../molecules/InnerTagElementContainer';
import { ActionGroupDistributionType } from '../../../gql/generated/globalTypes';
import { Typography } from '@material-ui/core';
import TagElementReadOnlyList from '../../molecules/TagElementReadOnlyList';
import { extractCurrentElementLog } from '../../../utils/PreviewUtils';
import { PreviewFrameActionGroup } from './PreviewFrameActionGroup';
import { actionsToListItems } from '../../../utils/ElementListUtils';
import { Action } from '../../../types/TagRulesTypes';
import {
    ActionGroupDistributionStatus,
    ActionGroupStatus,
    ActionStatus,
} from '../../../types/PreviewFrameTypes';
import { previewFrameContext } from '../../../context/PreviewFrameContext';

type PreviewFrameActionGroupDistributionProps = {
    actionGroupDistributionStatus: ActionGroupDistributionStatus;
    actionGroupDistributionData: PreviewFrameData_getRevision_tags_rule_groups_rules_action_groups_distributions;
    ruleContext: {
        ruleGroupCompleted: boolean;
        ruleId: string;
        ruleIndex: number;
    };
};

const getActionStatus: (actionGroupStatus: ActionGroupStatus, actionId: string) => ActionStatus = (
    actionGroupStatus: ActionGroupStatus,
    actionId: string,
) => {
    const status: ActionStatus | undefined = actionGroupStatus.actions.find(
        (_) => _.actionId === actionId,
    );

    if (status === undefined) {
        return {
            actionId,
            executed: false,
        };
    }

    return status;
};

const PreviewFrameActionGroupDistribution: FC<PreviewFrameActionGroupDistributionProps> = (
    props: PreviewFrameActionGroupDistributionProps,
) => {
    const { actionGroupDistributionStatus, actionGroupDistributionData, ruleContext } = props;

    const { gotoElement, currentTagCode, revisionStatus } = useContext(previewFrameContext);

    const getActionGroupStatus: (actionGroupId: string) => ActionGroupStatus = (
        actionGroupId: string,
    ) => {
        const status: ActionGroupStatus | undefined =
            actionGroupDistributionStatus.actionGroups.find(
                (_) => _.actionGroupId === actionGroupId,
            );

        if (status === undefined) {
            return {
                actionGroupId,
                actions: [],
                executed: false,
            };
        }

        return status;
    };

    return (
        <InnerTagElementContainer
            key={actionGroupDistributionData.id}
            id={actionGroupDistributionData.id}
            title={`${
                actionGroupDistributionData.parent_type === 'REVISION'
                    ? 'Global Action Group Distribution: '
                    : ''
            }${actionGroupDistributionData.name} - Distribution Type: ${
                actionGroupDistributionData.action_group_distribution_type
            }`}
            readonly={true}
            actions={[]}
            applied={actionGroupDistributionStatus.executed}
            appliedVerb="Executed"
            highlight={actionGroupDistributionData.parent_type === 'REVISION'}
            ruleGroupCompleted={ruleContext.ruleGroupCompleted}
        >
            {actionGroupDistributionData.action_group_distribution_type ===
                ActionGroupDistributionType.NONE &&
            actionGroupDistributionData.action_groups.length > 0 ? (
                <TagElementReadOnlyList
                    title="Actions"
                    itemName="action"
                    itemType="action"
                    items={actionsToListItems(
                        actionGroupDistributionData.action_groups[0].actions as Action[],
                    ).map((_) => {
                        const log = extractCurrentElementLog(
                            'action',
                            currentTagCode,
                            ruleContext.ruleId,
                            ruleContext.ruleIndex,
                            _.id,
                            revisionStatus === undefined ? [] : revisionStatus.log,
                        );

                        const applied =
                            log !== undefined && log.filter((_) => !_.isError).length > 0;
                        return {
                            ..._,
                            log,
                            applied,
                        };
                    })}
                    ruleGroupCompleted={ruleContext.ruleGroupCompleted}
                    appliedVerb={'Executed'}
                    gotoElement={gotoElement}
                />
            ) : (
                <>
                    {actionGroupDistributionData.action_groups.length === 0 && (
                        <Typography>No action group defined.</Typography>
                    )}
                    {actionGroupDistributionData.action_groups.map((actionGroup) => (
                        <PreviewFrameActionGroup
                            key={actionGroup.id}
                            actionGroupData={actionGroup}
                            actionGroupStatus={getActionGroupStatus(actionGroup.id)}
                            ruleContext={ruleContext}
                        />
                    ))}
                </>
            )}
        </InnerTagElementContainer>
    );
};

export { PreviewFrameActionGroupDistribution, getActionStatus };
