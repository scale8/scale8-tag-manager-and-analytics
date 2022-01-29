import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import DeleteGlobalTriggerQuery from '../../../../gql/mutations/DeleteGlobalTriggerQuery';
import { DeleteGlobalTrigger } from '../../../../gql/generated/DeleteGlobalTrigger';
import {
    DialogDeletePreview,
    DialogDeletePreviewProps,
} from '../../../abstractions/DialogDeletePreview';
import { DialogMutationFunction } from '../../../abstractions/DialogDirectMutation';
import { FormMutationData } from '../../../../hooks/form/useFormValidation';
import { DeleteActionGroup } from '../../../../gql/generated/DeleteActionGroup';
import { modelsDeleteReducer } from '../../../../utils/ArrayUtils';

const GlobalTriggerDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    const buildModelsDeletedMap = (data: DeleteGlobalTrigger) =>
        data.deleteTrigger.reduce(
            modelsDeleteReducer,
            new Map<string, { name: string; id: string }[]>(),
        );

    const findName = (data: FormMutationData | DeleteActionGroup) => {
        const modelsDeletedMap = buildModelsDeletedMap(data as DeleteGlobalTrigger);

        const triggerModels = modelsDeletedMap.get('Trigger');
        return triggerModels ? triggerModels[0].name : '';
    };

    const dialogDeletePreviewProps: DialogDeletePreviewProps = {
        mutation: DeleteGlobalTriggerQuery,
        executePreviewMutationCallback: async (
            mutationFunction: DialogMutationFunction,
            id: string,
        ) => {
            await mutationFunction({
                variables: {
                    triggerDeleteInput: {
                        trigger_id: id,
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
                    triggerDeleteInput: {
                        trigger_id: id,
                        ...(comments === '' ? {} : { comments }),
                    },
                },
            });
        },
        buildText: (data: FormMutationData | DeleteGlobalTrigger) => {
            return `Deleting the trigger "${findName(data)}" will also delete:`;
        },
        buildTextNoGroups: (data: FormMutationData | DeleteActionGroup) => {
            return `Delete the trigger: ${findName(data)}?`;
        },
        buildGroups: (data: FormMutationData | DeleteGlobalTrigger) => {
            const modelsDeletedMap = buildModelsDeletedMap(data as DeleteGlobalTrigger);

            const groups: {
                title: string;
                items: { name: string; id: string }[];
            }[] = [];

            [
                { model: 'Event', label: 'Events' },
                { model: 'ConditionRule', label: 'Condition Rules' },
                { model: 'ExceptionRule', label: 'Exception Rules' },
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

export default GlobalTriggerDelete;
