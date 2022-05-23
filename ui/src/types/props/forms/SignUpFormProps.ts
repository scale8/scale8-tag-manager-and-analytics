import { FormProps } from '../../../hooks/form/useFormValidation';
import { ApolloError } from '@apollo/client';
import { RefObject } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { SignUpUrlType } from '../SignUpTypes';

export type SignUpValues = {
    newPassword: string;
    newPasswordConfirm: string;
    domain: string;
    orgName: string;
    fullName: string;
    email: string;
    agree: boolean;
    CAPTCHAToken: string;
};

export type SignUpFormProps = FormProps<SignUpValues> & {
    gqlError?: ApolloError;
    success: boolean;
    email?: string;
    type: SignUpUrlType;
    target: string | undefined;
    loading: boolean;
    qsEmail: string | undefined;
    captcha: RefObject<HCaptcha>;
};
