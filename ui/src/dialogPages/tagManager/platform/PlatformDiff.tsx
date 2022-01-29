import { FC } from 'react';
import { useQuery } from '@apollo/client';
import DiffPlatformQuery from '../../../gql/queries/DiffPlatformQuery';
import { DiffPlatform } from '../../../gql/generated/DiffPlatform';
import { RevisionDiff } from '../../../components/molecules/Diff/RevisionDiff';
import { DialogPageProps } from '../../../types/DialogTypes';
import { QueryLoaderAndError } from '../../../abstractions/QueryLoaderAndError';

const PlatformDiff: FC<DialogPageProps> = (props: DialogPageProps) => {
    return QueryLoaderAndError<DiffPlatform>(
        false,
        useQuery<DiffPlatform>(DiffPlatformQuery, {
            variables: {
                leftId: props.id,
                rightId: props.contextId,
            },
        }),
        (data: DiffPlatform) => {
            const objKey = data.platformRevisionDifference[0].id;

            return (
                <RevisionDiff
                    title="Platform Revision Comparison"
                    objKey={objKey}
                    revisionDiffs={data.platformRevisionDifference}
                    revisionLeftId={props.id}
                    revisionRightId={props.contextId}
                    handleDialogClose={props.handleDialogClose}
                    formInfoProps={{
                        side: 'right',
                        id: 'platformRevisionsDiff',
                    }}
                />
            );
        },
    );
};

export default PlatformDiff;
