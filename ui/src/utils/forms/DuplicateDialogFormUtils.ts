import { FormProps } from '../../hooks/form/useFormValidation';
import { ValidateConfiguration } from '../validators/validateFormValues';
import nameValidator from '../validators/nameValidator';

export type DuplicateValues = {
    name: string;
};

export type DuplicateFormProps = FormProps<DuplicateValues>;

const DuplicateValidators: ValidateConfiguration<DuplicateValues>[] = [
    {
        field: 'name',
        validator: nameValidator,
        error: () => 'New name too short',
    },
];

export { DuplicateValidators };
