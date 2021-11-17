import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import {
    DialogDirectMutation,
    DialogMutationFunction,
} from '../../../abstractions/DialogDirectMutation';
import { GlobalActionGroupDistributionUnlinkInput } from '../../../../gql/generated/globalTypes';
import UnLinkGlobalActionQuery from '../../../../gql/mutations/UnLinkGlobalActionQuery';

const ActionGroupDistributionUnlink: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
                contextId: string,
            ) => {
                const globalActionGroupDistributionUnlinkInput: GlobalActionGroupDistributionUnlinkInput =
                    {
                        rule_id: contextId,
                        global_action_group_distribution_id: id,
                    };
                await mutationFunction({
                    variables: { globalActionGroupDistributionUnlinkInput },
                });
            }}
            mutation={UnLinkGlobalActionQuery}
            {...props}
        />
    );
};

export default ActionGroupDistributionUnlink;
