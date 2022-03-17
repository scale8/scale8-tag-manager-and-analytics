import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import UnsubscribeSection from './orgSettings/UnsubscribeSection';
import { AccountProduct } from '../../gql/generated/globalTypes';

const CancelTagManagerPlan: FC<DialogPageProps> = (dialogProps: DialogPageProps) => (
    <UnsubscribeSection {...dialogProps} accountProduct={AccountProduct.TAG_MANAGER} />
);

export default CancelTagManagerPlan;
