import { FC, useState } from 'react';
import Loader from '../../components/organisms/Loader';
import { FormProps, useFormValidation } from '../../hooks/form/useFormValidation';
import { useMutation, useQuery } from '@apollo/client';
import LoggedUserQuery from '../../gql/queries/LoggedUserQuery';
import { LoggedUser } from '../../gql/generated/LoggedUser';
import GithubPreparationForm from '../../components/organisms/Forms/GithubPreparationForm';
import { DialogPageProps } from '../../types/DialogTypes';
import { QueryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import { Box, DialogActions, DialogContent } from '@mui/material';
import FormGqlError from '../../components/atoms/FormGqlError';
import GithubAccountRemoveQuery from '../../gql/mutations/GithubAccountRemoveQuery';
import { GithubAccountRemoveValues } from '../../gql/generated/GithubAccountRemoveValues';
import { logError } from '../../utils/logUtils';
import { DialogConfirmButton } from '../../components/atoms/DialogConfirmButton';
import { DialogCancelButton } from '../../components/atoms/DialogCancelButton';
import { openSignInWindow } from '../../utils/SignInUtils';
import { getApiUrl } from '../../utils/ConfigUtils';
import nameValidator from '../../utils/validators/nameValidator';
import { useLoggedInState } from '../../context/AppContext';

type GithubAccountAfterLoadProps = DialogPageProps & {
    hasLinkedSSO: boolean;
    githubUser: string | null;
};

export type GitHubPreparationValues = {
    githubUser: string;
};

export type GitHubPreparationFormProps = FormProps<GitHubPreparationValues> & {
    handleDialogClose: (checkChanges: boolean) => void;
    ssoError: string;
};

const GithubAccountUseForm: FC<GithubAccountAfterLoadProps> = (
    props: GithubAccountAfterLoadProps,
) => {
    const [ssoError, setSsoError] = useState('');

    const { loggedInUserState } = useLoggedInState();
    const userId = loggedInUserState.loggedUserId;

    const submitForm = async (gitHubPreparationValues: GitHubPreparationValues) => {
        try {
            const ssoResult: {
                uid: string;
                token: string;
            } = await openSignInWindow(
                `${getApiUrl()}/auth/github?login=${
                    gitHubPreparationValues.githubUser
                }&user_id=${userId}`,
            );

            if (ssoResult !== null) {
                localStorage.setItem('uid', ssoResult.uid);
                localStorage.setItem('token', ssoResult.token);
            }

            props.handleDialogClose(false);
            props.pageRefresh();
        } catch (e: any) {
            props.handleDialogClose(false);
            setSsoError(`GitHub login failed: ${e.message}`);
        }
    };

    const initialState = {
        githubUser: '',
    };

    const formValidationValues = useFormValidation<GitHubPreparationValues>(
        initialState,
        [
            {
                field: 'githubUser',
                validator: nameValidator,
                error: () => 'GitHub username too short',
            },
        ],
        submitForm,
    );

    const formProps: GitHubPreparationFormProps = {
        ...formValidationValues,
        ssoError,
        submitText: 'Connect Github Account',
        title: 'Connect Github Account',
        handleDialogClose: props.handleDialogClose,
    };

    return <GithubPreparationForm {...formProps} />;
};

const RemoveGithubAccountUseForm: FC<GithubAccountAfterLoadProps> = (
    props: GithubAccountAfterLoadProps,
) => {
    const [GithubAccountRemove, { loading, data, error: gqlError }] =
        useMutation<GithubAccountRemoveValues>(GithubAccountRemoveQuery);

    if (loading) {
        return <Loader />;
    }

    if (data?.removeGitHubLink) {
        props.handleDialogClose(false);
    }

    return (
        <Box display="flex" flexDirection="column">
            <DialogContent sx={{ minHeight: 248 }}>
                <FormGqlError error={gqlError} />
                This account is connected to the github account:
                <br />
                <b>{props.githubUser}</b>
            </DialogContent>
            <DialogActions sx={{ padding: 2, justifyContent: 'center' }}>
                <DialogCancelButton onClick={() => props.handleDialogClose(false)}>
                    Cancel
                </DialogCancelButton>
                <DialogConfirmButton
                    onClick={() => {
                        (async () => {
                            try {
                                await GithubAccountRemove();
                            } catch (error) {
                                logError(error);
                            }
                        })();
                    }}
                >
                    Disconnect Github Account
                </DialogConfirmButton>
            </DialogActions>
        </Box>
    );
};

const GithubAccountAfterLoad: FC<GithubAccountAfterLoadProps> = (
    props: GithubAccountAfterLoadProps,
) => {
    if (props.hasLinkedSSO) {
        return <RemoveGithubAccountUseForm {...props} />;
    } else {
        return <GithubAccountUseForm {...props} />;
    }
};

const GithubAccount: FC<DialogPageProps> = (props: DialogPageProps) => {
    return QueryLoaderAndError<LoggedUser>(
        false,
        useQuery<LoggedUser>(LoggedUserQuery),
        (data: LoggedUser) => {
            return (
                <GithubAccountAfterLoad
                    hasLinkedSSO={data.me.github_connected}
                    githubUser={data.me.github_user}
                    {...props}
                />
            );
        },
    );
};

export { GithubAccount };
