import { FormProps } from '../../../hooks/form/useFormValidation';
import { ApolloError } from '@apollo/client';

export type ResetPasswordValues = {
    newPassword: string;
    newPasswordConfirm: string;
};

export type ResetPasswordFormProps = FormProps<ResetPasswordValues> & {
    gqlError?: ApolloError;
};
