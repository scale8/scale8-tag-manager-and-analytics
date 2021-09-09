import { FC } from 'react';
import { DialogPageProps } from '../../../types/DialogTypes';
import { DialogEntityHistory } from '../../abstractions/DialogEntityHistory';

const AppRevisionHistory: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <DialogEntityHistory infoKeyBase="appRevisions" {...props} />;
};

export { AppRevisionHistory };
