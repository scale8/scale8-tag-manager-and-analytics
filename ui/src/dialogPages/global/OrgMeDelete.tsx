import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import DeleteOrgMeQuery from '../../gql/mutations/DeleteOrgMeQuery';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';

const OrgMeDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: {
                        orgRemoveMeInput: { org_id: id },
                    },
                });
            }}
            mutation={DeleteOrgMeQuery}
            {...props}
        />
    );
};

export default OrgMeDelete;
