import { FC } from 'react';
import DeleteActionGroupDistributionQuery from '../../../../gql/mutations/DeleteActionGroupDistributionQuery';
import { DeleteActionGroupDistribution } from '../../../../gql/generated/DeleteActionGroupDistribution';
import { DialogPageProps } from '../../../../types/DialogTypes';
import {
    DialogDeletePreview,
    DialogDeletePreviewProps,
} from '../../../abstractions/DialogDeletePreview';
import { DialogMutationFunction } from '../../../abstractions/DialogDirectMutation';
import { FormMutationData } from '../../../../hooks/form/useFormValidation';
import { DeleteActionGroup } from '../../../../gql/generated/DeleteActionGroup';
import { modelsDeleteReducer } from '../../../../utils/ArrayUtils';

const ActionGroupDistributionDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    const buildModelsDeletedMap = (data: DeleteActionGroupDistribution) =>
        data.deleteActionGroupDistribution.reduce(
            modelsDeleteReducer,
            new Map<string, { name: string; id: string }[]>(),
        );

    const findName = (data: FormMutationData | DeleteActionGroup) => {
        const modelsDeletedMap = buildModelsDeletedMap(data as DeleteActionGroupDistribution);

        const actionGroupDistributionModels = modelsDeletedMap.get('ActionGroupDistribution');
        return actionGroupDistributionModels ? actionGroupDistributionModels[0].name : '';
    };

    const dialogDeletePreviewProps: DialogDeletePreviewProps = {
        mutation: DeleteActionGroupDistributionQuery,
        executePreviewMutationCallback: async (
            mutationFunction: DialogMutationFunction,
            id: string,
        ) => {
            await mutationFunction({
                variables: {
                    actionGroupDistributionDeleteInput: {
                        action_group_distribution_id: id,
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
                    actionGroupDistributionDeleteInput: {
                        action_group_distribution_id: id,
                        ...(comments === '' ? {} : { comments }),
                    },
                },
            });
        },
        buildText: (data: FormMutationData | DeleteActionGroupDistribution) => {
            return `Deleting the action group distribution "${findName(data)}" will also delete:`;
        },
        buildTextNoGroups: (data: FormMutationData | DeleteActionGroup) => {
            return `Delete action group distribution: ${findName(data)}?`;
        },
        buildGroups: (data: FormMutationData | DeleteActionGroupDistribution) => {
            const modelsDeletedMap = buildModelsDeletedMap(data as DeleteActionGroupDistribution);

            const groups: {
                title: string;
                items: { name: string; id: string }[];
            }[] = [];

            [
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

export default ActionGroupDistributionDelete;
