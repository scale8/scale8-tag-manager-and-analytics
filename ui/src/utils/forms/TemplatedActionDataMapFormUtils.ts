import { ValidateConfiguration } from '../validators/validateFormValues';
import keyValidator from '../validators/keyValidator';
import { PlatformDataMapValidation } from '../../types/DataMapsTypes';

export type TemplatedActionDataMapValues = {
    key: string;
    type: string;
    description: string;
    defaultValue: S8DataMapValue;
    defaultValues: S8DataMapValue[];
    optionValues: S8DataMapValue[] | undefined;
    validationRules: PlatformDataMapValidation[] | undefined;
    optional: boolean;
    useDefault: boolean;
};

const TemplatedActionDataMapValidators: ValidateConfiguration<TemplatedActionDataMapValues>[] = [
    {
        field: 'key',
        validator: keyValidator,
        error: () => 'Invalid key',
    },
];

export { TemplatedActionDataMapValidators };
