import { FC, useState } from 'react';
import Head from 'next/head';
import Loader from '../components/organisms/Loader';
import { openSignInWindow } from '../utils/SignInUtils';
import { useMutation } from '@apollo/client';
import LoginQuery from '../gql/mutations/LoginQuery';
import { Login2FAInput, LoginInput } from '../gql/generated/globalTypes';
import { useFormValidation } from '../hooks/form/useFormValidation';
import LoginForm from '../components/organisms/Forms/LoginForm';
import { toOrgSelect, toSignUp } from '../utils/NavigationPaths';
import TwoFactorLoginForm from '../components/organisms/Forms/TwoFactorLoginForm';
import TwoFactorLoginQuery from '../gql/mutations/TwoFactorLoginQuery';
import emailValidator from '../utils/validators/emailValidator';
import passwordValidator from '../utils/validators/passwordValidator';
import code2faValidator from '../utils/validators/code2faValidator';
import { getApiUrl } from '../utils/ConfigUtils';
import Navigate from '../components/atoms/Next/Navigate';
import {
    LoginValues,
    TwoFactorLoginProps,
    TwoFactorLoginValues,
} from '../types/props/forms/LoginFormProps';
import LoggedOutSectionWithConfig from '../containers/global/LoggedOutSectionWithConfig';
import { logError } from '../utils/logUtils';
import { ComponentWithParams, ParamsLoader } from '../components/atoms/ParamsLoader';
import { clearAuthSession } from '../utils/authUtils';

const TwoFactorLogin: FC<TwoFactorLoginProps> = (props: TwoFactorLoginProps) => {
    const [login2fa, { loading, data, error: gqlError }] = useMutation(TwoFactorLoginQuery);

    const initialState = {
        code: '',
    };

    const submitTwoFactorLogin = async (twoFactorLoginValues: TwoFactorLoginValues) => {
        const login2faInput: Login2FAInput = {
            uid: props.uid,
            temp_token: props.temp_token,
            code: twoFactorLoginValues.code.toString(),
        };
        try {
            await login2fa({
                variables: { login2faInput },
            });
        } catch (error) {
            logError(error);
        }
    };

    const twoFactorLoginFormProps = {
        ...useFormValidation<TwoFactorLoginValues>(
            initialState,
            [
                {
                    field: 'code',
                    validator: code2faValidator,
                    error: () => 'Invalid Code',
                },
            ],
            submitTwoFactorLogin,
        ),
        gqlError,
        submitText: 'Sign In',
        title: 'Sign In',
        handleDialogClose: () => {
            // not in dialog
        },
    };

    if (loading) return <Loader />;

    if (data?.login2fa !== undefined) {
        localStorage.setItem('uid', data.login2fa.uid);
        localStorage.setItem('token', data.login2fa.token);
        return <Navigate to={toOrgSelect} />;
    }

    return <TwoFactorLoginForm {...twoFactorLoginFormProps} />;
};

const LoginContent: FC<{ reason: string | undefined }> = (props: {
    reason: string | undefined;
}) => {
    const { reason } = props;

    const [loggedInSso, setLoggedInSso] = useState(false);
    const [ssoNew, setSsoNew] = useState<{
        username: string;
        email: string;
    } | null>(null);
    const [ssoError, setSsoError] = useState('');
    const [login, { loading, data, error: gqlError }] = useMutation(LoginQuery);

    const submitLogin = async (loginValues: LoginValues) => {
        clearAuthSession();

        const loginInput: LoginInput = {
            email: loginValues.email,
            password: loginValues.password,
        };
        try {
            await login({
                variables: { login: loginInput },
            });
        } catch (error) {
            logError(error);
        }
    };

    const handleGithubButtonClick = async () => {
        try {
            const ssoResult: {
                uid: string;
                token: string;
                is_new: boolean;
                username: string;
                email: string;
            } = await openSignInWindow(`${getApiUrl()}/auth/github`);

            if (ssoResult !== null) {
                if (ssoResult.is_new) {
                    setSsoNew({
                        username: ssoResult.username,
                        email: ssoResult.email,
                    });
                } else {
                    localStorage.setItem('uid', ssoResult.uid);
                    localStorage.setItem('token', ssoResult.token);
                    setLoggedInSso(true);
                }
            } else {
                setSsoError(`GitHub login failed`);
            }
        } catch (e: any) {
            setSsoError(`GitHub login failed: ${e.message}`);
        }
    };

    const initialState = {
        email: '',
        password: '',
    };

    const loginFormProps = {
        ...useFormValidation<LoginValues>(
            initialState,
            [
                {
                    field: 'email',
                    validator: emailValidator,
                    error: () => 'Invalid email address',
                },
                {
                    field: 'password',
                    validator: passwordValidator,
                    error: () => 'Password must be at least 3 characters',
                },
            ],
            submitLogin,
        ),
        handleGithubButtonClick,
        gqlError,
        ssoError,
        reason,
        submitText: 'Sign In',
        title: 'Sign In',
        handleDialogClose: () => {
            // not in dialog
        },
    };

    if (loading) return <Loader />;

    if (data?.login !== undefined) {
        if (data.login.token === undefined && data.login.temp_token !== undefined) {
            return <TwoFactorLogin temp_token={data.login.temp_token} uid={data.login.uid} />;
        } else {
            localStorage.setItem('uid', data.login.uid);
            localStorage.setItem('token', data.login.token);
            return <Navigate to={toOrgSelect} />;
        }
    }

    if (ssoNew !== null) {
        return <Navigate to={toSignUp({ email: ssoNew.email, github_id: ssoNew.username })} />;
    }

    if (loggedInSso) {
        return <Navigate to={toOrgSelect} />;
    }

    return (
        <>
            <LoginForm {...loginFormProps} />
        </>
    );
};

const Login: ComponentWithParams = ({ params }) => {
    const { reason } = params;

    return (
        <>
            <Head>
                <title>Scale8 - Log in</title>
                <meta name="description" content="Scale8 - Log in page." />
            </Head>
            <LoggedOutSectionWithConfig>
                <LoginContent reason={reason} />
            </LoggedOutSectionWithConfig>
        </>
    );
};

const LoginLoader = () => <ParamsLoader Child={Login} />;
export default LoginLoader;
