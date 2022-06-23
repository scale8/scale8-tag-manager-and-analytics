import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';
import AdminManualInvoicingQuery from '../../gql/mutations/AdminManualInvoicingQuery';

const AdminManualInvoicing: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: { switchToManualInvoicingInput: { org_id: id } },
                });
            }}
            mutation={AdminManualInvoicingQuery}
            {...props}
        />
    );
};

export default AdminManualInvoicing;
