import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import UnsubscribeSection from './orgSettings/UnsubscribeSection';
import { AccountProduct } from '../../gql/generated/globalTypes';

const CancelDataManagerPlan: FC<DialogPageProps> = (dialogProps: DialogPageProps) => (
    <UnsubscribeSection {...dialogProps} accountProduct={AccountProduct.DATA_MANAGER} />
);

export default CancelDataManagerPlan;
