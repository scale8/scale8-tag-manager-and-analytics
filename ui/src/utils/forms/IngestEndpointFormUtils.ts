import { ValidateConfiguration } from '../validators/validateFormValues';
import nameValidator from '../validators/nameValidator';
import { StorageProviderFields, storageProviderValidators } from '../StorageProviderUtils';

export type IngestEndpointValues = StorageProviderFields & {
    name: string;
    analyticsEnabled: boolean;
};

const IngestEndpointValidators: ValidateConfiguration<IngestEndpointValues>[] = [
    {
        field: 'name',
        validator: nameValidator,
        error: () => 'Ingest Endpoint name too short',
    },
    ...storageProviderValidators,
];

export { IngestEndpointValidators };
