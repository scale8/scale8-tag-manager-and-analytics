import { FC, useEffect } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import StartDataManagerTrialQuery from '../../gql/mutations/StartDataManagerTrialQuery';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';
import { useRouter } from 'next/router';
import { toDataManager } from '../../utils/NavigationPaths';

const RedirectToDataManager: FC<{
    data: any;
}> = (props: { data: any }) => {
    const router = useRouter();

    useEffect(() => {
        router.push(toDataManager({ id: props.data.startDataManagerTrial.id })).then();
    });

    return null;
};

const DataManagerStartTrial: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: {
                        startDataManagerTrialInput: { org_id: id },
                    },
                });
            }}
            mutation={StartDataManagerTrialQuery}
            renderData={RedirectToDataManager}
            {...props}
            pageRefresh={() => {
                //no need to refresh
            }}
        />
    );
};

export default DataManagerStartTrial;
