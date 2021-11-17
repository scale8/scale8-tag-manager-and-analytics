import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';

import { IngestEndpointDataMapInspectOrEdit } from './IngestEndpointDataMapUpdate';

const IngestEndpointDataMapInspect: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <IngestEndpointDataMapInspectOrEdit {...props} readOnly={true} />;
};

export default IngestEndpointDataMapInspect;
