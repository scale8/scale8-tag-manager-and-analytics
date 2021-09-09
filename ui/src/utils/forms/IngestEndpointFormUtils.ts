import { ValidateConfiguration } from '../validators/validateFormValues';
import nameValidator from '../validators/nameValidator';

export type IngestEndpointValues = {
    name: string;
};

const IngestEndpointValidators: ValidateConfiguration<IngestEndpointValues>[] = [
    {
        field: 'name',
        validator: nameValidator,
        error: () => 'Ingest Endpoint name too short',
    },
];

export { IngestEndpointValidators };
