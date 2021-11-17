import { FC, useEffect } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import BillingPortalQuery from '../../gql/mutations/BillingPortalQuery';
import { DialogDirectMutation, DialogMutationFunction } from '../abstractions/DialogDirectMutation';

const BillingPortalQueryOpen: FC<{
    data: any;
}> = (props: { data: any }) => {
    const url = props.data.getBillingPortalUrl;

    useEffect(() => {
        window.location.replace(url);
    }, [url]);

    return null;
};

const OpenOrgBillingPage: FC<DialogPageProps> = (props: DialogPageProps) => {
    const currentPath = window.location.href;

    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
            ) => {
                await mutationFunction({
                    variables: {
                        billingPortalInput: {
                            org_id: id,
                            return_url: currentPath,
                        },
                    },
                });
            }}
            renderData={BillingPortalQueryOpen}
            mutation={BillingPortalQuery}
            {...props}
        />
    );
};

export default OpenOrgBillingPage;
