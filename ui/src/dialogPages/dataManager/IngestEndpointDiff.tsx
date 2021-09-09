import { FC } from 'react';
import { RevisionDiff } from '../../components/molecules/Diff/RevisionDiff';
import { useQuery } from '@apollo/client';
import { DiffIngestEndpoint } from '../../gql/generated/DiffIngestEndpoint';
import DiffIngestEndpointQuery from '../../gql/queries/DiffIngestEndpointQuery';
import { DialogPageProps } from '../../types/DialogTypes';
import { queryLoaderAndError } from '../../abstractions/QueryLoaderAndError';

const IngestEndpointDiff: FC<DialogPageProps> = (props: DialogPageProps) => {
    return queryLoaderAndError<DiffIngestEndpoint>(
        false,
        useQuery<DiffIngestEndpoint>(DiffIngestEndpointQuery, {
            variables: {
                leftId: props.id,
                rightId: props.contextId,
            },
        }),
        (data: DiffIngestEndpoint) => {
            const objKey = data.ingestEndpointRevisionDifference[0].id;

            return (
                <RevisionDiff
                    title="Revision Comparison"
                    objKey={objKey}
                    revisionDiffs={data.ingestEndpointRevisionDifference}
                    revisionLeftId={props.id}
                    revisionRightId={props.contextId}
                    handleDialogClose={props.handleDialogClose}
                    formInfoProps={{
                        side: 'right',
                        id: 'ingestEndpointRevisionsDiff',
                    }}
                />
            );
        },
    );
};

export { IngestEndpointDiff };
