import { FC } from 'react';
import { DialogPageProps } from '../../../types/DialogTypes';
import { DialogMutationFunction } from '../../abstractions/DialogDirectMutation';
import UnLinkAppPlatformRevisionQuery from '../../../gql/mutations/UnLinkAppPlatformRevisionQuery';
import { modelsLinkReducer } from '../../../utils/ArrayUtils';
import { unLinkAppPlatformRevisionValues } from '../../../gql/generated/unLinkAppPlatformRevisionValues';
import {
    DialogDeletePreview,
    DialogDeletePreviewProps,
} from '../../abstractions/DialogDeletePreview';
import { FormMutationData } from '../../../hooks/form/useFormValidation';

const AppPlatformRevisionDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    const buildModelsUnlinkMap = (data: unLinkAppPlatformRevisionValues) =>
        data.unlinkPlatformRevision.reduce(
            modelsLinkReducer,
            new Map<string, { name: string; id: string }[]>(),
        );

    const dialogDeletePreviewProps: DialogDeletePreviewProps = {
        mutation: UnLinkAppPlatformRevisionQuery,
        executePreviewMutationCallback: async (
            mutationFunction: DialogMutationFunction,
            id: string,
        ) => {
            await mutationFunction({
                variables: {
                    appPlatformRevisionUnlinkInput: {
                        app_platform_revision_id: id,
                        preview: true,
                    },
                },
            });
        },
        executeMutationCallback: async (mutationFunction: DialogMutationFunction, id: string) => {
            await mutationFunction({
                variables: {
                    appPlatformRevisionUnlinkInput: {
                        app_platform_revision_id: id,
                    },
                },
            });
        },
        buildText: () => {
            return `Unlinking Revision "${props.name}" will require the removal of:`;
        },
        buildTextNoGroups: () => {
            return `Unlink Revision: ${props.name}?`;
        },
        buildGroups: (data: FormMutationData | unLinkAppPlatformRevisionValues) => {
            const modelsDeletedMap = buildModelsUnlinkMap(data as unLinkAppPlatformRevisionValues);

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

export default AppPlatformRevisionDelete;
