import { FC, useEffect } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';
import StartTagManagerTrialQuery from '../../gql/mutations/StartTagManagerTrialQuery';
import { useRouter } from 'next/router';
import { toTagManager } from '../../utils/NavigationPaths';

const redirectToTagManager: FC<{
    data: any;
}> = (props: { data: any }) => {
    const router = useRouter();

    useEffect(() => {
        router
            .push(toTagManager({ id: props.data.startTagManagerTrial.id, action: 'add' }, 'apps'))
            .then();
    }, []);

    return null;
};

const TagManagerStartTrial: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: { startTagManagerTrialInput: { org_id: id } },
                });
            }}
            mutation={StartTagManagerTrialQuery}
            renderData={redirectToTagManager}
            {...props}
            pageRefresh={() => {
                //no need to refresh
            }}
        />
    );
};

export { TagManagerStartTrial };
