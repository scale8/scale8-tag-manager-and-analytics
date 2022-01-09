import { ValidateConfiguration } from '../validators/validateFormValues';
import domainValidator from '../validators/domainValidator';
import { FormProps } from '../../hooks/form/useFormValidation';

export type CustomDomainValues = {
    domain: string;
    certificate: string;
    key: string;
};

export const CustomDomainValidators: ValidateConfiguration<CustomDomainValues>[] = [
    {
        field: 'domain',
        validator: domainValidator,
        error: () => 'Invalid domain',
        ignoreEmpty: true,
    },
];

export type CustomDomainFormProps = FormProps<CustomDomainValues> & {
    installDomain: string;
};
