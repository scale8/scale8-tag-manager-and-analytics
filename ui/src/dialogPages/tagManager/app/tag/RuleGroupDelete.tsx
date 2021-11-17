import { FC } from 'react';
import DeleteRuleGroupQuery from '../../../../gql/mutations/DeleteRuleGroupQuery';
import { DeleteRuleGroup } from '../../../../gql/generated/DeleteRuleGroup';
import { DialogPageProps } from '../../../../types/DialogTypes';
import {
    DialogDeletePreview,
    DialogDeletePreviewProps,
} from '../../../abstractions/DialogDeletePreview';
import { DialogMutationFunction } from '../../../abstractions/DialogDirectMutation';
import { FormMutationData } from '../../../../hooks/form/useFormValidation';
import { DeleteActionGroup } from '../../../../gql/generated/DeleteActionGroup';
import { modelsDeleteReducer } from '../../../../utils/ArrayUtils';

const RuleGroupDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    const buildModelsDeletedMap = (data: DeleteRuleGroup) =>
        data.deleteRuleGroup.reduce(
            modelsDeleteReducer,
            new Map<string, { name: string; id: string }[]>(),
        );

    const findName = (data: FormMutationData | DeleteActionGroup) => {
        const modelsDeletedMap = buildModelsDeletedMap(data as DeleteRuleGroup);

        const ruleGroupModels = modelsDeletedMap.get('RuleGroup');
        return ruleGroupModels ? ruleGroupModels[0].name : '';
    };

    const dialogDeletePreviewProps: DialogDeletePreviewProps = {
        mutation: DeleteRuleGroupQuery,
        executePreviewMutationCallback: async (
            mutationFunction: DialogMutationFunction,
            id: string,
        ) => {
            await mutationFunction({
                variables: {
                    ruleGroupDeleteInput: {
                        rule_group_id: id,
                        preview: true,
                    },
                },
            });
        },
        executeMutationCallback: async (
            mutationFunction: DialogMutationFunction,
            id: string,
            contextId: string,
            ids: string[],
            comments: string,
        ) => {
            await mutationFunction({
                variables: {
                    ruleGroupDeleteInput: {
                        rule_group_id: id,
                        ...(comments === '' ? {} : { comments }),
                    },
                },
            });
        },
        buildText: (data: FormMutationData | DeleteRuleGroup) => {
            return `Deleting the ruleGroup "${findName(data)}" will also delete:`;
        },
        buildTextNoGroups: (data: FormMutationData | DeleteActionGroup) => {
            return `Delete the ruleGroup: ${findName(data)}?`;
        },
        buildGroups: (data: FormMutationData | DeleteRuleGroup) => {
            const modelsDeletedMap = buildModelsDeletedMap(data as DeleteRuleGroup);

            const groups: {
                title: string;
                items: { name: string; id: string }[];
            }[] = [];

            [
                { model: 'Rule', label: 'Rules' },
                { model: 'Event', label: 'Events' },
                { model: 'ConditionRule', label: 'Condition Rules' },
                { model: 'ExceptionRule', label: 'Exception Rules' },
                {
                    model: 'ActionGroupDistribution',
                    label: 'Action Group Distributions',
                },
                { model: 'ActionGroup', label: 'Action Groups' },
                { model: 'Action', label: 'Actions' },
                { model: 'DataMap', label: 'Data Maps' },
                { model: 'RepeatedDataMap', label: 'Repeated Data Maps' },
            ].forEach((_) => {
                const items = modelsDeletedMap.get(_.model);
                if (items !== undefined) {
                    groups.push({
                        title: `${_.label} (${items.length})`,
                        items,
                    });
                }
            });

            return groups;
        },
        ...props,
    };

    return <DialogDeletePreview {...dialogDeletePreviewProps} />;
};

export default RuleGroupDelete;
