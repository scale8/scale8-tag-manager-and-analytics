import { FC } from 'react';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { DialogEntityHistory } from '../../../abstractions/DialogEntityHistory';

const ActionHistory: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <DialogEntityHistory infoKeyBase="actions" {...props} />;
};

export { ActionHistory };
