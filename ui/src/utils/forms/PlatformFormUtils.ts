import { PlatformType } from '../../gql/generated/globalTypes';
import { ValidateConfiguration } from '../validators/validateFormValues';
import nameValidator from '../validators/nameValidator';
import descriptionValidator from '../validators/descriptionValidator';

export type PlatformValues = {
    name: string;
    description: string;
    fileName: string;
    type?: PlatformType;
};

const PlatformValidators: ValidateConfiguration<PlatformValues>[] = [
    {
        field: 'name',
        validator: nameValidator,
        error: () => 'Platform name too short',
    },
    {
        field: 'description',
        validator: descriptionValidator,
        error: () => 'Description too short',
    },
];

export { PlatformValidators };
