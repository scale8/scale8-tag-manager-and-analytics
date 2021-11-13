import { FC } from 'react';
import Head from 'next/head';
import { useMutation } from '@apollo/client';
import SetupQuery from '../gql/mutations/SetupQuery';
import { FormValues, useFormValidation } from '../hooks/form/useFormValidation';
import newPasswordValidator from '../utils/validators/newPasswordValidator';
import confirmPasswordValidator from '../utils/validators/confirmPasswordValidator';
import emailValidator from '../utils/validators/emailValidator';
import nameValidator from '../utils/validators/nameValidator';
import Loader from '../components/organisms/Loader';
import SetupForm from '../components/organisms/Forms/SetupForm';
import { CreateFirstOrgInput, Mode } from '../gql/generated/globalTypes';
import { SetupValues } from '../types/props/forms/SetupFormProps';
import Navigate from '../components/atoms/Next/Navigate';
import LoggedOutSectionWithConfig from '../containers/global/LoggedOutSectionWithConfig';
import { useConfigState } from '../context/AppContext';
import { toLogin } from '../utils/NavigationPaths';
import { logError } from '../utils/logUtils';
import CommercialDevIndex from '../components/organisms/CommercialDevIndex';

const SetupContent: FC = () => {
    const { isConfigured, mode, isDev } = useConfigState();

    const [setup, { loading, data, error: gqlError }] = useMutation(SetupQuery);

    const submitSetup = async (setupValues: SetupValues) => {
        const setupInput: CreateFirstOrgInput = {
            org_name: setupValues.orgName,
            first_name: setupValues.firstName,
            last_name: setupValues.lastName,
            email: setupValues.email,
            password: setupValues.newPassword,
        };
        try {
            await setup({
                variables: { createFirstOrgInput: setupInput },
            });
        } catch (error) {
            logError(error);
        }
    };

    const initialState = {
        newPassword: '',
        newPasswordConfirm: '',
        email: '',
        orgName: '',
        firstName: '',
        lastName: '',
    };

    const setupFormProps = {
        ...useFormValidation<SetupValues>(
            initialState,
            [
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
                    field: 'email',
                    validator: emailValidator,
                    error: () => 'Invalid email address',
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
                    field: 'firstName',
                    validator: nameValidator,
                    error: () => 'First name too short',
                },
                {
                    field: 'lastName',
                    validator: nameValidator,
                    error: () => 'Last name too short',
                },
            ],
            submitSetup,
        ),
        gqlError,
        submitText: 'Build Initial Configuration',
        title: 'Setup',
        handleDialogClose: () => {
            // not in dialog
        },
    };

    if (mode === Mode.COMMERCIAL && isDev) {
        return <CommercialDevIndex />;
    }

    if (isConfigured) {
        return <Navigate to={toLogin} />;
    }

    if (loading) return <Loader />;

    if (data?.createFirstOrg !== undefined) {
        return <Navigate to={toLogin} />;
    }

    return <SetupForm {...setupFormProps} />;
};

const Home: FC = () => {
    return (
        <>
            <Head>
                <title>Scale8 - Setup</title>
                <meta name="description" content="Scale8 - Setup page." />
            </Head>
            <LoggedOutSectionWithConfig>
                <SetupContent />
            </LoggedOutSectionWithConfig>
        </>
    );
};

export default Home;
