import { FC } from 'react';
import { useQuery } from '@apollo/client';
import DiffAppQuery from '../../../gql/queries/DiffAppQuery';
import { DiffApp } from '../../../gql/generated/DiffApp';
import { RevisionDiff } from '../../../components/molecules/Diff/RevisionDiff';
import { DialogPageProps } from '../../../types/DialogTypes';
import { QueryLoaderAndError } from '../../../abstractions/QueryLoaderAndError';

const AppDiff: FC<DialogPageProps> = (props: DialogPageProps) => {
    return QueryLoaderAndError<DiffApp>(
        false,
        useQuery<DiffApp>(DiffAppQuery, {
            variables: {
                leftId: props.id,
                rightId: props.contextId,
            },
        }),
        (data: DiffApp) => {
            const objKey = data.revisionDifference[0].id;

            return (
                <RevisionDiff
                    title="Revision Comparison"
                    objKey={objKey}
                    revisionDiffs={data.revisionDifference}
                    revisionLeftId={props.id}
                    revisionRightId={props.contextId}
                    handleDialogClose={props.handleDialogClose}
                    formInfoProps={{
                        side: 'right',
                        id: 'appRevisionsDiff',
                    }}
                />
            );
        },
    );
};

export default AppDiff;
