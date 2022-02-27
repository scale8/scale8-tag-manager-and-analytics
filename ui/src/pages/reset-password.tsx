import { FC } from 'react';
import Head from 'next/head';
import { useMutation } from '@apollo/client';
import LoggedOutSection from '../containers/global/LoggedOutSection';
import ResetPasswordQuery from '../gql/mutations/ResetPasswordQuery';
import { ResetPasswordValues } from '../types/props/forms/ResetPasswordFormProps';
import { ResetPasswordInput } from '../gql/generated/globalTypes';
import { useFormValidation } from '../hooks/form/useFormValidation';
import newPasswordValidator from '../utils/validators/newPasswordValidator';
import confirmPasswordValidator from '../utils/validators/confirmPasswordValidator';
import Loader from '../components/organisms/Loader';
import Navigate from '../components/atoms/Next/Navigate';
import { toOrgSelect } from '../utils/NavigationPaths';
import ResetPasswordForm from '../components/organisms/Forms/ResetPasswordForm';
import { logError } from '../utils/logUtils';
import { ComponentWithParams, ParamsLoader } from '../components/atoms/ParamsLoader';
import { clearAuthSession } from '../utils/authUtils';

const ResetPasswordContent: FC<{ token: string }> = ({ token }) => {
    const [resetPassword, { loading, data, error: gqlError }] = useMutation(ResetPasswordQuery);

    const submit = async (resetPasswordValues: ResetPasswordValues) => {
        clearAuthSession();

        const resetPasswordInput: ResetPasswordInput = {
            token: token,
            new_password: resetPasswordValues.newPassword,
        };
        try {
            await resetPassword({
                variables: { resetPasswordInput },
            });
        } catch (error) {
            logError(error);
        }
    };

    const initialState = {
        newPassword: '',
        newPasswordConfirm: '',
    };

    const resetPasswordFormProps = {
        ...useFormValidation<ResetPasswordValues>(
            initialState,
            [
                {
                    field: 'newPassword',
                    validator: newPasswordValidator,
                    error: () => 'New Password too short',
                },
                {
                    field: 'newPasswordConfirm',
                    validator: confirmPasswordValidator,
                    error: () => "Passwords don't Match",
                },
            ],
            submit,
        ),
        gqlError,
        submitText: 'Reset',
        title: 'Reset Password',
        handleDialogClose: () => {
            // not in dialog
        },
    };

    if (loading) return <Loader />;

    if (data) {
        localStorage.setItem('uid', data.resetPassword.uid);
        localStorage.setItem('token', data.resetPassword.token);
        return <Navigate to={toOrgSelect} />;
    }

    return (
        <>
            <Head>
                <title>Scale8 - Password Reset</title>
                <meta name="description" content="Scale8 - Password Reset." />
            </Head>
            <ResetPasswordForm {...resetPasswordFormProps} />
        </>
    );
};

const ResetPassword: ComponentWithParams = ({ params }) => {
    const { token } = params;

    return (
        <>
            <Head>
                <title>Scale8 - Password Reset</title>
                <meta name="description" content="Scale8 - Password Reset." />
            </Head>
            <LoggedOutSection>
                {token !== undefined && <ResetPasswordContent token={token} />}
            </LoggedOutSection>
        </>
    );
};

const ResetPasswordLoader = () => <ParamsLoader Child={ResetPassword} />;
export default ResetPasswordLoader;
