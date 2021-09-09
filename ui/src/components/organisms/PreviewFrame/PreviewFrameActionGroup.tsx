import { FC, useContext } from 'react';
import { PreviewFrameData_getRevision_tags_rule_groups_rules_action_groups_distributions_action_groups } from '../../../gql/generated/PreviewFrameData';
import { extractCurrentElementLog } from '../../../utils/PreviewUtils';
import TagElementReadOnlyList from '../../molecules/TagElementReadOnlyList';
import { InnerTagElementContainer } from '../../molecules/InnerTagElementContainer';
import { actionsToListItems } from '../../../utils/ElementListUtils';
import { Action } from '../../../types/TagRulesTypes';
import { ActionGroupStatus } from '../../../types/PreviewFrameTypes';
import { previewFrameContext } from '../../../context/PreviewFrameContext';

type PreviewFrameActionGroupProps = {
    actionGroupStatus: ActionGroupStatus;
    actionGroupData: PreviewFrameData_getRevision_tags_rule_groups_rules_action_groups_distributions_action_groups;
    ruleContext: {
        ruleGroupCompleted: boolean;
        ruleId: string;
        ruleIndex: number;
    };
};

const PreviewFrameActionGroup: FC<PreviewFrameActionGroupProps> = (
    props: PreviewFrameActionGroupProps,
) => {
    const { actionGroupStatus, actionGroupData, ruleContext } = props;

    const { gotoElement, currentTagCode, revisionStatus } = useContext(previewFrameContext);

    return (
        <InnerTagElementContainer
            key={actionGroupData.id}
            id={actionGroupData.id}
            title={`${actionGroupData.name} - Distribution: ${actionGroupData.distribution / 10}%`}
            readonly={true}
            actions={[]}
            applied={actionGroupStatus.executed}
            appliedVerb="Executed"
            ruleGroupCompleted={ruleContext.ruleGroupCompleted}
        >
            <TagElementReadOnlyList
                title="Actions"
                itemName="action"
                itemType="action"
                items={actionsToListItems(actionGroupData.actions as Action[]).map((_) => {
                    const log = extractCurrentElementLog(
                        'action',
                        currentTagCode,
                        ruleContext.ruleId,
                        ruleContext.ruleIndex,
                        _.id,
                        revisionStatus === undefined ? [] : revisionStatus.log,
                    );

                    const applied = log !== undefined && log.filter((_) => !_.isError).length > 0;
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
        </InnerTagElementContainer>
    );
};

export { PreviewFrameActionGroup };
