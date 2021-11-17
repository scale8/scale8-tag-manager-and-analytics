import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { IngestEndpointDataMapCreateWithLevel } from './IngestEndpointDataMapCreate';

const IngestEndpointDataMapCreateLastLevel: FC<DialogPageProps> = (props: DialogPageProps) => {
    return <IngestEndpointDataMapCreateWithLevel lastLevel={true} {...props} />;
};

export default IngestEndpointDataMapCreateLastLevel;
