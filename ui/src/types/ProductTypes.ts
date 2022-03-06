import { AccountProduct } from '../gql/generated/globalTypes';
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
    accountProduct: AccountProduct;
    valuesRefresh: (mustResetCache: boolean) => void;
    product: ListProductData;
    pageActionProps: PageActionProps;
    currentProductId: string | null;
};
