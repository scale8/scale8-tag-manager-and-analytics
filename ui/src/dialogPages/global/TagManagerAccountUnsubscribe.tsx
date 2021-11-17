import { FC } from 'react';
import { AccountProduct } from '../../gql/generated/globalTypes';
import { DialogPageProps } from '../../types/DialogTypes';
import { AccountUnsubscribe } from './AccountUnsubscribe';

const TagManagerAccountUnsubscribe: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <AccountUnsubscribe {...props} product={AccountProduct.TAG_MANAGER} />;
};

export default TagManagerAccountUnsubscribe;
