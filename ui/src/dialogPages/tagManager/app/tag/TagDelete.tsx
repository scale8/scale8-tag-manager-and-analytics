import { FC } from 'react';
import DeleteTagQuery from '../../../../gql/mutations/DeleteTagQuery';
import { DeleteTag } from '../../../../gql/generated/DeleteTag';
import { DialogPageProps } from '../../../../types/DialogTypes';
import {
    DialogDeletePreview,
    DialogDeletePreviewProps,
} from '../../../abstractions/DialogDeletePreview';
import { DialogMutationFunction } from '../../../abstractions/DialogDirectMutation';
import { FormMutationData } from '../../../../hooks/form/useFormValidation';
import { DeleteActionGroup } from '../../../../gql/generated/DeleteActionGroup';
import { modelsDeleteReducer } from '../../../../utils/ArrayUtils';

const TagDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    const buildModelsDeletedMap = (data: DeleteTag) =>
        data.deleteTag.reduce(
            modelsDeleteReducer,
            new Map<string, { name: string; id: string }[]>(),
        );

    const findName = (data: FormMutationData | DeleteActionGroup) => {
        const modelsDeletedMap = buildModelsDeletedMap(data as DeleteTag);

        const tagModels = modelsDeletedMap.get('Tag');
        return tagModels ? tagModels[0].name : '';
    };

    const dialogDeletePreviewProps: DialogDeletePreviewProps = {
        mutation: DeleteTagQuery,
        executePreviewMutationCallback: async (
            mutationFunction: DialogMutationFunction,
            id: string,
        ) => {
            await mutationFunction({
                variables: {
                    tagDeleteInput: {
                        tag_id: id,
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
                    tagDeleteInput: {
                        tag_id: id,
                        ...(comments === '' ? {} : { comments }),
                    },
                },
            });
        },
        buildText: (data: FormMutationData | DeleteTag) => {
            return `Deleting the tag "${findName(data)}" will also delete:`;
        },
        buildTextNoGroups: (data: FormMutationData | DeleteActionGroup) => {
            return `Delete the tag: ${findName(data)}?`;
        },
        buildGroups: (data: FormMutationData | DeleteTag) => {
            const modelsDeletedMap = buildModelsDeletedMap(data as DeleteTag);

            const groups: {
                title: string;
                items: { name: string; id: string }[];
            }[] = [];

            [
                { model: 'RuleGroup', label: 'Rule Groups' },
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

export default TagDelete;
