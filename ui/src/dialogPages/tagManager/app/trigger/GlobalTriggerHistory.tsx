import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogEntityHistory } from '../../../abstractions/DialogEntityHistory';

const GlobalTriggerHistory: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <DialogEntityHistory infoKeyBase="globalTriggers" {...props} />;
};

export { GlobalTriggerHistory };
