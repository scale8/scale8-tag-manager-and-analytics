import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import FinaliseIngestEndpointRevisionQuery from '../../gql/mutations/FinaliseIngestEndpointRevisionQuery';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';

const IngestEndpointRevisionFinalise: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: {
                        finaliseIngestEndpointRevisionInput: {
                            ingest_endpoint_revision_id: id,
                        },
                    },
                });
            }}
            mutation={FinaliseIngestEndpointRevisionQuery}
            {...props}
        />
    );
};

export { IngestEndpointRevisionFinalise };
