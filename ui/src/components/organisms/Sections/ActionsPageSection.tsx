import { FC } from 'react';
import { Action } from '../../../types/TagRulesTypes';
import { PageActionProps, pageActions } from '../../../actions/PageActions';
import TagElementList from '../../molecules/TagElementList';
import { actionsToListItems } from '../../../utils/ElementListUtils';
import { moveDownId, moveUpId } from '../../../utils/ArrayUtils';

type ActionsSectionProps = {
    actions: Action[];
    actionGroupId: string;
    revisionLocked: boolean;
    pageActionProps: PageActionProps;
    actionGroupsDistributionId: string;
};

const ActionsPageSection: FC<ActionsSectionProps> = (props: ActionsSectionProps) => {
    const { actions, pageActionProps } = props;
    const actionsIds = actions.map((action) => action.id);
    return (
        <TagElementList
            disabled={props.revisionLocked}
            title="Actions"
            addButtonText="Add Action"
            items={actionsToListItems(actions)}
            addButtonClick={() =>
                pageActions.createAction(
                    pageActionProps,
                    props.actionGroupId,
                    props.actionGroupsDistributionId,
                )
            }
            editButtonClick={(id: string) =>
                pageActions.updateAction(pageActionProps, id, props.actionGroupsDistributionId)
            }
            historyButtonClick={(id: string, name: string) =>
                pageActions.showActionHistory(pageActionProps, id, name)
            }
            deleteButtonClick={(id: string, name: string) =>
                pageActions.deleteAction(pageActionProps, id, name)
            }
            moveUpClick={(id: string) => {
                pageActions.updateActionOrder(
                    pageActionProps,
                    props.actionGroupId,
                    moveUpId(actionsIds, id),
                );
            }}
            moveDownClick={(id: string) => {
                pageActions.updateActionOrder(
                    pageActionProps,
                    props.actionGroupId,
                    moveDownId(actionsIds, id),
                );
            }}
            inspectButtonClick={(id: string) =>
                pageActions.inspectAction(pageActionProps, id, props.actionGroupsDistributionId)
            }
        />
    );
};

export { ActionsPageSection };
