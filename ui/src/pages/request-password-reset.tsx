import { FC } from 'react';
import Head from 'next/head';
import { useMutation } from '@apollo/client';
import RequestPasswordResetQuery from '../gql/mutations/RequestPasswordResetQuery';
import { RequestPasswordResetValues } from '../types/props/forms/PasswordResetFormProps';
import { SendPasswordResetInput } from '../gql/generated/globalTypes';
import { useFormValidation } from '../hooks/form/useFormValidation';
import emailValidator from '../utils/validators/emailValidator';
import Loader from '../components/organisms/Loader';
import LoggedOutFormContainer from '../components/molecules/LoggedOutFormContainer';
import { Box } from '@mui/material';
import RequestPasswordResetForm from '../components/organisms/Forms/RequestPasswordResetForm';
import FormTitle from '../components/molecules/FormTitle';
import Link from '../components/atoms/Next/Link';
import LoggedOutSectionWithConfig from '../containers/global/LoggedOutSectionWithConfig';
import { useConfigState } from '../context/AppContext';
import { logError } from '../utils/logUtils';
import { ComponentWithParams, ParamsLoader } from '../components/atoms/ParamsLoader';
import { clearAuthSession } from '../utils/authUtils';

const RequestPasswordResetContent: FC<{ email: string | undefined }> = (props: {
    email: string | undefined;
}) => {
    const { email } = props;
    const { useEmail } = useConfigState();

    const [sendPasswordResetEmail, { loading, data, error: gqlError }] =
        useMutation(RequestPasswordResetQuery);

    const submit = async (requestPasswordResetValues: RequestPasswordResetValues) => {
        clearAuthSession();

        const sendPasswordResetInput: SendPasswordResetInput = {
            email: requestPasswordResetValues.email,
        };
        try {
            await sendPasswordResetEmail({
                variables: { sendPasswordResetInput },
            });
        } catch (error) {
            logError(error);
        }
    };

    const initialState = {
        email: email ?? '',
    };

    const requestPasswordResetFormProps = {
        ...useFormValidation<RequestPasswordResetValues>(
            initialState,
            [
                {
                    field: 'email',
                    validator: emailValidator,
                    error: () => 'Invalid email address',
                },
            ],
            submit,
        ),
        gqlError,
        submitText: 'Send Verification Email',
        title: 'Reset Password',
        fixedEmail: !!email,
        handleDialogClose: () => {
            // not in dialog
        },
    };

    if (loading) return <Loader />;

    if (data) {
        return (
            <LoggedOutFormContainer>
                <Box fontSize={18} width="100%" textAlign="center">
                    Please <b>click the link in the email</b> we have just sent you.
                </Box>
                <Box pt={1} />
                <Box fontSize={18} width="100%" textAlign="center">
                    Could this have gone to your spam folder?
                </Box>
            </LoggedOutFormContainer>
        );
    }

    if (useEmail) {
        return <RequestPasswordResetForm {...requestPasswordResetFormProps} />;
    }

    return (
        <LoggedOutFormContainer>
            <Box mb={2}>
                <FormTitle title="Reset your password?" />
            </Box>
            <>
                Please contact an <b>organization administrator</b> to request a new password.
                <br />
                <br />
                <br />
                <Link href={'/login'} variant="body2">
                    Back to log in page
                </Link>
            </>
        </LoggedOutFormContainer>
    );
};

const RequestPasswordReset: ComponentWithParams = ({ params }) => {
    const { email } = params;

    return (
        <>
            <Head>
                <title>Scale8 - Password Reset</title>
                <meta name="description" content="Scale8 - Password Reset." />
            </Head>
            <LoggedOutSectionWithConfig>
                <RequestPasswordResetContent email={email} />
            </LoggedOutSectionWithConfig>
        </>
    );
};

const RequestPasswordResetLoader = () => <ParamsLoader Child={RequestPasswordReset} />;
export default RequestPasswordResetLoader;
