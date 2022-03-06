import { PageActionProps } from '../actions/PageActions';

export type ListProductData = {
    id: string;
    name: string;
    amount: number;
    page_views?: number;
    requests?: number;
    gbs?: number;
};

export type ProductButtonProps = {
    type: 'tag' | 'data';
    orgId: string;
    product?: ListProductData;
    pageActionProps: PageActionProps;
    currentProductId: string | null;
    subscriptionType: 'free' | 'paid';
};
