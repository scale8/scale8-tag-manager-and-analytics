import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import DeleteOrgQuery from '../../gql/mutations/DeleteOrgQuery';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';
import { useRouter } from 'next/router';
import { toOrgList } from '../../utils/NavigationPaths';

const OrgDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    const router = useRouter();

    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: { orgDeleteInput: { id } },
                });
            }}
            mutation={DeleteOrgQuery}
            {...props}
            pageRefresh={() => {
                router.push(toOrgList).then();
            }}
        />
    );
};

export default OrgDelete;
