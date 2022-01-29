import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { DialogEntityHistory } from '../abstractions/DialogEntityHistory';

const IngestEndpointRevisionHistory: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <DialogEntityHistory infoKeyBase="ingestEndpointRevisions" {...props} />;
};

export default IngestEndpointRevisionHistory;
