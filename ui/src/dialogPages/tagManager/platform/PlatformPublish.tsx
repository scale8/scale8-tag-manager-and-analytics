import { FC } from 'react';
import { DialogPageProps } from '../../../types/DialogTypes';
import {
    DialogDirectMutation,
    DialogMutationFunction,
} from '../../abstractions/DialogDirectMutation';
import PublishPlatformQuery from '../../../gql/mutations/PublishPlatformQuery';

const PlatformPublish: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: {
                        platformPublishInput: {
                            platform_id: id,
                        },
                    },
                });
            }}
            mutation={PublishPlatformQuery}
            {...props}
        />
    );
};

export { PlatformPublish };
