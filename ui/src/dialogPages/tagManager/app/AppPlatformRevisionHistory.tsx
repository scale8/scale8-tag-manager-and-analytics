import { FC } from 'react';
import { DialogPageProps } from '../../../types/DialogTypes';
import { DialogEntityHistory } from '../../abstractions/DialogEntityHistory';

const AppPlatformRevisionHistory: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <DialogEntityHistory infoKeyBase="appPlatformRevisions" {...props} />;
};

export { AppPlatformRevisionHistory };
