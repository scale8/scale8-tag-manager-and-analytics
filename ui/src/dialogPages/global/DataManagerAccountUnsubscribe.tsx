import { FC } from 'react';
import { AccountProduct } from '../../gql/generated/globalTypes';
import { DialogPageProps } from '../../types/DialogTypes';
import { AccountUnsubscribe } from './AccountUnsubscribe';

const DataManagerAccountUnsubscribe: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <AccountUnsubscribe {...props} product={AccountProduct.DATA_MANAGER} />;
};

export { DataManagerAccountUnsubscribe };
