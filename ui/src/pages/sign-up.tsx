import { createRef, FC } from 'react';
import Head from 'next/head';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { FormValues, useFormValidation } from '../hooks/form/useFormValidation';
import { useMutation } from '@apollo/client';
import SignUpQuery from '../gql/mutations/SignUpQuery';
import { SignUpInput, SignUpType } from '../gql/generated/globalTypes';
import { buildSignUpType } from '../utils/SignUpUtils';
import nameValidator from '../utils/validators/nameValidator';
import emailValidator from '../utils/validators/emailValidator';
import domainValidator from '../utils/validators/domainValidator';
import newPasswordValidator from '../utils/validators/newPasswordValidator';
import confirmPasswordValidator from '../utils/validators/confirmPasswordValidator';
import requiredStringValidator from '../utils/validators/requiredStringValidator';
import SignUpForm from '../components/organisms/Forms/SignUpForm';
import LoggedOutSection from '../containers/global/LoggedOutSection';
import { SignUpValues } from '../types/props/forms/SignUpFormProps';
import { logError } from '../utils/logUtils';
import { ComponentWithParams, ParamsLoader } from '../components/atoms/ParamsLoader';

type SignUpContentProps = {
    type?: string;
    email?: string;
    gitHubId?: string;
    target?: string;
    inviteId?: string;
};

const SignUpContent: FC<SignUpContentProps> = (props: SignUpContentProps) => {
    const { type, target, inviteId, email: qsEmail, gitHubId } = props;

    const captcha = createRef<HCaptcha>();

    const [signup, { loading, data, error: gqlError }] = useMutation(SignUpQuery);

    const submitSignUp = async (signUpValues: SignUpValues) => {
        localStorage.removeItem('uid');
        localStorage.removeItem('token');

        const email = qsEmail ?? signUpValues.email;

        const signUpType = buildSignUpType(type);

        const signUpInput: SignUpInput = {
            full_name: signUpValues.fullName,
            temp_access_code: signUpValues.tempAccessCode,
            captcha_token: signUpValues.CAPTCHAToken,
            sign_up_type: signUpType,
            org_name: signUpType === SignUpType.INVITE ? target : signUpValues.orgName,
            ...(email !== undefined ? { email } : {}),
            ...(inviteId !== undefined ? { invite_id: inviteId } : {}),
            ...(gitHubId !== null ? { git_hub_user: gitHubId } : {}),
            ...(signUpType === SignUpType.TAG_MANAGER ? { domain: signUpValues.domain } : {}),
            ...(signUpValues.newPassword !== '' ? { password: signUpValues.newPassword } : {}),
        };
        try {
            await signup({
                variables: { signUpInput },
            });
        } catch (error) {
            logError(error);
        }
    };

    const initialState = {
        newPassword: '',
        newPasswordConfirm: '',
        domain: '',
        orgName: '',
        fullName: '',
        email: '',
        CAPTCHAToken: '',
        tempAccessCode: '',
        agree: false,
    };

    const signupFormProps = {
        ...useFormValidation<SignUpValues>(
            initialState,
            [
                {
                    field: 'fullName',
                    validator: nameValidator,
                    error: () => 'Name too short',
                },
                {
                    field: 'email',
                    validator: async <T extends FormValues>(
                        value: T[keyof T],
                    ): Promise<-1 | 0 | string> => {
                        if (value === '') return -1;
                        return emailValidator(value);
                    },
                    error: () => 'Invalid email address',
                },
                {
                    field: 'domain',
                    validator: async <T extends FormValues>(
                        value: T[keyof T],
                    ): Promise<-1 | 0 | string> => {
                        if (value === '') return -1;
                        return domainValidator(value);
                    },
                    error: () => 'Invalid domain',
                },
                {
                    field: 'orgName',
                    validator: async <T extends FormValues>(
                        value: T[keyof T],
                    ): Promise<-1 | 0 | string> => {
                        if (value === '') return -1;
                        return nameValidator(value);
                    },
                    error: () => 'Organization name too short',
                },
                {
                    field: 'agree',
                    validator: async <T extends FormValues>(
                        value: T[keyof T],
                    ): Promise<-1 | 0 | string> => {
                        return value ? -1 : 0;
                    },
                    error: () => 'You  must agree with the terms to create an account',
                },
                {
                    field: 'newPassword',
                    validator: async <T extends FormValues>(
                        value: T[keyof T],
                    ): Promise<-1 | 0 | string> => {
                        if (value === '') return -1;
                        return newPasswordValidator(value);
                    },
                    error: () => 'Password too short',
                },
                {
                    field: 'newPasswordConfirm',
                    validator: confirmPasswordValidator,
                    error: () => "Passwords don't Match",
                },
                {
                    field: 'CAPTCHAToken',
                    validator: requiredStringValidator,
                    error: () => 'Please prove that you are human',
                },
            ],
            submitSignUp,
            undefined,
            undefined,
            undefined,
            (values, setValues) => {
                if (captcha.current !== null) {
                    captcha.current.resetCaptcha();
                    setValues({
                        ...values,
                        CAPTCHAToken: '',
                    });
                }
            },
        ),
        gqlError,
        loading,
        submitText: 'Create Account',
        title: 'Sign Up',
        type: type ?? 'tag-manager',
        target,
        qsEmail,
        captcha,
        success: data?.signUp !== undefined,
        email: data?.signUp.email,
        handleDialogClose: () => {
            // not in dialog
        },
    };

    return <SignUpForm {...signupFormProps} />;
};

const SignUp: ComponentWithParams = ({ params }) => {
    const { type, email, github_id: gitHubId, target, invite_id: inviteId } = params;

    return (
        <>
            <Head>
                <title>Scale8 - Sign Up</title>
                <meta name="description" content="Scale8 - Sign Up page." />
            </Head>
            <LoggedOutSection>
                <SignUpContent
                    type={type}
                    email={email}
                    gitHubId={gitHubId}
                    target={target}
                    inviteId={inviteId}
                />
            </LoggedOutSection>
        </>
    );
};

const SignUpLoader = () => <ParamsLoader Child={SignUp} />;
export default SignUpLoader;
