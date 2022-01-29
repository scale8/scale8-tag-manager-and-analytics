import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogEntityHistory } from '../abstractions/DialogEntityHistory';

const IngestEndpointEnvironmentHistory: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <DialogEntityHistory infoKeyBase="ingestEndpointEnvironments" {...props} />;
};

export default IngestEndpointEnvironmentHistory;
