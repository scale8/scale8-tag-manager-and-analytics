import { FC } from 'react';
import { AccountProduct } from '../../gql/generated/globalTypes';
import { DialogPageProps } from '../../types/DialogTypes';
import { AccountSubscribe } from './AccountSubscribe';

const DataManagerAccountSubscribe: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <AccountSubscribe {...props} product={AccountProduct.DATA_MANAGER} />;
};

export default DataManagerAccountSubscribe;
