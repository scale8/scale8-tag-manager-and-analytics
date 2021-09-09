import { FormProps } from '../../../hooks/form/useFormValidation';
import { MouseEventHandler } from 'react';
import { ApolloError } from '@apollo/client';

export type LoginValues = {
    email: string;
    password: string;
};

export type LoginFormProps = FormProps<LoginValues> & {
    handleGithubButtonClick: MouseEventHandler;
    gqlError?: ApolloError;
    ssoError: string;
    reason?: string;
};

export type TwoFactorLoginProps = {
    uid: string;
    temp_token: string;
};

export type TwoFactorLoginValues = {
    code: string;
};

export type TwoFactorLoginFormProps = FormProps<TwoFactorLoginValues> & {
    gqlError?: ApolloError;
};
