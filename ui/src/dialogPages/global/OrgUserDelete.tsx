import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import DeleteOrgUserQuery from '../../gql/mutations/DeleteOrgUserQuery';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';

const OrgUserDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
                contextId: string,
            ) => {
                await mutationFunction({
                    variables: {
                        orgRemoveUserInput: { org_id: contextId, user_id: id },
                    },
                });
            }}
            mutation={DeleteOrgUserQuery}
            {...props}
        />
    );
};

export default OrgUserDelete;
