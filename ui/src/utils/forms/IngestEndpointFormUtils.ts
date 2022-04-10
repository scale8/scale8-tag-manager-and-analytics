import { ValidateConfiguration } from '../validators/validateFormValues';
import nameValidator from '../validators/nameValidator';
import { StorageProviderFields, storageProviderValidators } from '../StorageProviderUtils';
import { IngestSchemaWizard } from '../../gql/generated/globalTypes';

export type IngestEndpointValues = StorageProviderFields & {
    name: string;
    wizard: IngestSchemaWizard | '';
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
