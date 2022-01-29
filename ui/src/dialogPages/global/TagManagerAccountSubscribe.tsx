import { FC } from 'react';
import { AccountProduct } from '../../gql/generated/globalTypes';
import { DialogPageProps } from '../../types/DialogTypes';
import { AccountSubscribe } from './AccountSubscribe';

const TagManagerAccountSubscribe: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <AccountSubscribe {...props} product={AccountProduct.TAG_MANAGER} />;
};

export default TagManagerAccountSubscribe;
