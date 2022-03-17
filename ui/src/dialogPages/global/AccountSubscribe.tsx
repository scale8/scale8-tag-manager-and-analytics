import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import StripeCheckout from '../../components/atoms/StripeCheckout';
import AccountSubscribeQuery from '../../gql/mutations/AccountSubscribeQuery';
import { AccountProduct } from '../../gql/generated/globalTypes';
import { buildThankYouPath } from '../../utils/NavigationPaths';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';

const DataManagerStripeCheckout: FC<{
    data: any;
}> = (props: { data: any }) => {
    const subscribeResult = props.data.accountSubscribe;

    if (subscribeResult === null) {
        return null;
    } else {
        return <StripeCheckout session={subscribeResult} />;
    }
};

export type AccountSubscribeProps = DialogPageProps & {
    product: AccountProduct;
};

const AccountSubscribe: FC<AccountSubscribeProps> = (props: AccountSubscribeProps) => {
    const currentPath = window.location.href;
    const basePath = window.location.origin;
    const { product, ...dialogPageProps } = props;

    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
                contextId: string,
            ) => {
                await mutationFunction({
                    variables: {
                        accountSubscribeInput: {
                            org_id: contextId,
                            product_id: id,
                            success_url:
                                basePath +
                                buildThankYouPath(
                                    contextId,
                                    id,
                                    product === AccountProduct.TAG_MANAGER ? 'tag' : 'data',
                                ),
                            cancel_url: currentPath,
                            product,
                        },
                    },
                });
            }}
            renderData={DataManagerStripeCheckout}
            mutation={AccountSubscribeQuery}
            checkCloseAndRefresh={(data) => {
                const subscribeResult = data.accountSubscribe;
                return subscribeResult === null;
            }}
            {...dialogPageProps}
        />
    );
};

export { AccountSubscribe };
