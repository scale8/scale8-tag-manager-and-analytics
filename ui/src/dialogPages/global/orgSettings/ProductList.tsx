import { FC } from 'react';
import { PageActionProps } from '../../../actions/PageActions';
import { AccountProduct } from '../../../gql/generated/globalTypes';
import { useConfigState, useLoggedInState } from '../../../context/AppContext';
import { OrgSettingsSectionProps } from '../../../types/props/OrgSettingsSectionProps';
import { ProductListContent } from '../../../components/organisms/ProductListContent';

export type ProductListProps = OrgSettingsSectionProps & {
    accountProduct: AccountProduct;
    valuesRefresh: (mustResetCache: boolean) => void;
};

export type ListProductData = {
    id: string;
    name: string;
    amount: number;
    page_views?: number;
    requests?: number;
    gbs?: number;
};

export type ProductListButtonProps = ProductListProps & {
    product: ListProductData;
    pageActionProps: PageActionProps;
    currentProductId: string | null;
};

const ProductList: FC<ProductListProps> = (props: ProductListProps) => {
    const { tagManagerProducts, dataManagerProducts } = useConfigState();

    const { data } = props;

    const { templateInteractions } = useLoggedInState();
    const { dispatchDialogAction, setRefreshCurrentPage } = templateInteractions;

    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
        refresh: () => {
            setRefreshCurrentPage(true);
        },
    };

    const products: ListProductData[] =
        props.accountProduct === AccountProduct.TAG_MANAGER
            ? tagManagerProducts
            : dataManagerProducts;

    const tagManagerAccount = data.getOrg.tag_manager_account;
    const tagManagerProductId =
        tagManagerAccount === null ? null : tagManagerAccount.stripe_product_id;
    const dataManagerAccount = data.getOrg.data_manager_account;
    const dataManagerProductId =
        dataManagerAccount === null ? null : dataManagerAccount.stripe_product_id;
    const currentProductId =
        props.accountProduct === AccountProduct.TAG_MANAGER
            ? tagManagerProductId
            : dataManagerProductId;

    if (data.getOrg.manual_invoicing) {
        return (
            <>
                Your organization is using a <b>BESPOKE</b> plan.
            </>
        );
    }

    return (
        <ProductListContent
            products={products}
            currentProductId={currentProductId}
            pageActionProps={pageActionProps}
            {...props}
        />
    );
};

export default ProductList;
