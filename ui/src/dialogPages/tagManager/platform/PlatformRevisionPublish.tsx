import { FC } from 'react';
import { DialogPageProps } from '../../../types/DialogTypes';
import {
    DialogDirectMutation,
    DialogMutationFunction,
} from '../../abstractions/DialogDirectMutation';
import PublishPlatformRevisionQuery from '../../../gql/mutations/PublishPlatformRevisionQuery';

const PlatformRevisionPublish: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: {
                        publishPlatformRevisionInput: {
                            platform_revision_id: id,
                        },
                    },
                });
            }}
            mutation={PublishPlatformRevisionQuery}
            {...props}
        />
    );
};

export default PlatformRevisionPublish;
