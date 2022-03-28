import { FormProps } from '../../../hooks/form/useFormValidation';
import { ApolloError } from '@apollo/client';
import { RefObject } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export type SignUpValues = {
    newPassword: string;
    newPasswordConfirm: string;
    domain: string;
    orgName: string;
    fullName: string;
    email: string;
    agree: boolean;
    CAPTCHAToken: string;
    tempAccessCode: string;
};

export type SignUpFormProps = FormProps<SignUpValues> & {
    gqlError?: ApolloError;
    success: boolean;
    email?: string;
    type: string;
    target: string | undefined;
    loading: boolean;
    qsEmail: string | undefined;
    captcha: RefObject<HCaptcha>;
};
