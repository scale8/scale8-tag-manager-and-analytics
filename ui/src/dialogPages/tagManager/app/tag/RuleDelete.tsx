import { FC } from 'react';
import DeleteRuleQuery from '../../../../gql/mutations/DeleteRuleQuery';
import { DeleteRule } from '../../../../gql/generated/DeleteRule';
import { DialogPageProps } from '../../../../types/DialogTypes';
import {
    DialogDeletePreview,
    DialogDeletePreviewProps,
} from '../../../abstractions/DialogDeletePreview';
import { DialogMutationFunction } from '../../../abstractions/DialogDirectMutation';
import { FormMutationData } from '../../../../hooks/form/useFormValidation';
import { DeleteActionGroup } from '../../../../gql/generated/DeleteActionGroup';
import { modelsDeleteReducer } from '../../../../utils/ArrayUtils';

const RuleDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    const buildModelsDeletedMap = (data: DeleteRule) =>
        data.deleteRule.reduce(
            modelsDeleteReducer,
            new Map<string, { name: string; id: string }[]>(),
        );

    const findName = (data: FormMutationData | DeleteActionGroup) => {
        const modelsDeletedMap = buildModelsDeletedMap(data as DeleteRule);

        const ruleModels = modelsDeletedMap.get('Rule');
        return ruleModels ? ruleModels[0].name : '';
    };

    const dialogDeletePreviewProps: DialogDeletePreviewProps = {
        mutation: DeleteRuleQuery,
        executePreviewMutationCallback: async (
            mutationFunction: DialogMutationFunction,
            id: string,
        ) => {
            await mutationFunction({
                variables: {
                    ruleDeleteInput: {
                        rule_id: id,
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
                    ruleDeleteInput: {
                        rule_id: id,
                        ...(comments === '' ? {} : { comments }),
                    },
                },
            });
        },
        buildText: (data: FormMutationData | DeleteRule) => {
            return `Deleting the rule "${findName(data)}" will also delete:`;
        },
        buildTextNoGroups: (data: FormMutationData | DeleteActionGroup) => {
            return `Delete the rule: ${findName(data)}?`;
        },
        buildGroups: (data: FormMutationData | DeleteRule) => {
            const modelsDeletedMap = buildModelsDeletedMap(data as DeleteRule);

            const groups: {
                title: string;
                items: { name: string; id: string }[];
            }[] = [];

            [
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

export { RuleDelete };
