import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';
import AdminGoInQuery from '../../gql/mutations/AdminGoInQuery';

const AdminGoIn: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: { adminAddMeToOrgInput: { org_id: id } },
                });
            }}
            mutation={AdminGoInQuery}
            {...props}
        />
    );
};

export default AdminGoIn;
