import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { AccountProduct } from '../../gql/generated/globalTypes';
import AccountUnsubscribeQuery from '../../gql/mutations/AccountUnsubscribeQuery';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';

export type AccountUnsubscribeProps = DialogPageProps & {
    product: AccountProduct;
};

const AccountUnsubscribe: FC<AccountUnsubscribeProps> = (props: AccountUnsubscribeProps) => {
    const { product, ...dialogPageProps } = props;

    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: {
                        accountUnsubscribeInput: {
                            org_id: id,
                            product,
                        },
                    },
                });
            }}
            mutation={AccountUnsubscribeQuery}
            {...dialogPageProps}
        />
    );
};

export { AccountUnsubscribe };
