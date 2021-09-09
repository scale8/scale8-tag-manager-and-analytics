import { FC } from 'react';
import { DialogPageProps } from '../../../types/DialogTypes';
import { DialogEntityHistory } from '../../abstractions/DialogEntityHistory';

const EnvironmentHistory: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <DialogEntityHistory infoKeyBase="appEnvironments" {...props} />;
};

export { EnvironmentHistory };
