import { FormProps } from '../../../hooks/form/useFormValidation';
import { ApolloError } from '@apollo/client';

export type SetupValues = {
    newPassword: string;
    newPasswordConfirm: string;
    email: string;
    orgName: string;
    firstName: string;
    lastName: string;
};

export type SetupFormProps = FormProps<SetupValues> & {
    gqlError?: ApolloError;
};
