import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import DeleteUserInviteQuery from '../../gql/mutations/DeleteUserInviteQuery';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';

const OrgUserCancelInvitation: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
                contextId: string,
            ) => {
                await mutationFunction({
                    variables: {
                        orgCancelInviteInput: {
                            org_id: contextId,
                            invite_id: id,
                        },
                    },
                });
            }}
            mutation={DeleteUserInviteQuery}
            {...props}
        />
    );
};

export { OrgUserCancelInvitation };
