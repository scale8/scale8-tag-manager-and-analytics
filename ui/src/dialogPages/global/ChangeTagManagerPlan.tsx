import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import ChangePlan from './ChangePlan';

const ChangeTagManagerPlan: FC<DialogPageProps> = (dialogProps: DialogPageProps) => (
    <ChangePlan type="tag" {...dialogProps} />
);

export default ChangeTagManagerPlan;
