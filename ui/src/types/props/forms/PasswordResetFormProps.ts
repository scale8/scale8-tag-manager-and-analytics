import { ApolloError } from '@apollo/client';
import { FormProps } from '../../../hooks/form/useFormValidation';

export type RequestPasswordResetValues = {
    email: string;
};

export type RequestPasswordResetFormProps = FormProps<RequestPasswordResetValues> & {
    gqlError?: ApolloError;
    fixedEmail: boolean;
};
