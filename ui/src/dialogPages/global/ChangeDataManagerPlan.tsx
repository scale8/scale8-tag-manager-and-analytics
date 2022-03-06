import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import ChangePlan from './ChangePlan';

const ChangeDataManagerPlan: FC<DialogPageProps> = (dialogProps: DialogPageProps) => (
    <ChangePlan type="data" {...dialogProps} />
);

export default ChangeDataManagerPlan;
