import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import DeleteIngestEndpointEnvironmentQuery from '../../gql/mutations/DeleteIngestEndpointEnvironmentQuery';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';

const IngestEndpointEnvironmentDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: {
                        ingestEndpointEnvironmentDeleteInput: {
                            ingest_endpoint_environment_id: id,
                        },
                    },
                });
            }}
            mutation={DeleteIngestEndpointEnvironmentQuery}
            {...props}
        />
    );
};

export default IngestEndpointEnvironmentDelete;
