import { FC } from 'react';
import DeleteActionGroupQuery from '../../../../gql/mutations/DeleteActionGroupQuery';
import { DeleteActionGroup } from '../../../../gql/generated/DeleteActionGroup';
import { DialogPageProps } from '../../../../types/DialogTypes';
import {
    DialogDeletePreview,
    DialogDeletePreviewProps,
} from '../../../abstractions/DialogDeletePreview';
import { DialogMutationFunction } from '../../../abstractions/DialogDirectMutation';
import { FormMutationData } from '../../../../hooks/form/useFormValidation';
import { modelsDeleteReducer } from '../../../../utils/ArrayUtils';

const ActionGroupDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    const buildModelsDeletedMap = (data: DeleteActionGroup) =>
        data.deleteActionGroup.reduce(
            modelsDeleteReducer,
            new Map<string, { name: string; id: string }[]>(),
        );

    const findName = (data: FormMutationData | DeleteActionGroup) => {
        const modelsDeletedMap = buildModelsDeletedMap(data as DeleteActionGroup);

        const actionGroupModels = modelsDeletedMap.get('ActionGroup');
        return actionGroupModels ? actionGroupModels[0].name : '';
    };

    const dialogDeletePreviewProps: DialogDeletePreviewProps = {
        mutation: DeleteActionGroupQuery,
        executePreviewMutationCallback: async (
            mutationFunction: DialogMutationFunction,
            id: string,
        ) => {
            await mutationFunction({
                variables: {
                    actionGroupDeleteInput: {
                        action_group_id: id,
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
                    actionGroupDeleteInput: {
                        action_group_id: id,
                        ...(comments === '' ? {} : { comments }),
                    },
                },
            });
        },
        buildText: (data: FormMutationData | DeleteActionGroup) => {
            return `Deleting the action group "${findName(data)}" will also delete:`;
        },
        buildTextNoGroups: (data: FormMutationData | DeleteActionGroup) => {
            return `Delete action group: ${findName(data)}?`;
        },
        buildGroups: (data: FormMutationData | DeleteActionGroup) => {
            const modelsDeletedMap = buildModelsDeletedMap(data as DeleteActionGroup);

            const groups: {
                title: string;
                items: { name: string; id: string }[];
            }[] = [];

            [
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

export { ActionGroupDelete };
