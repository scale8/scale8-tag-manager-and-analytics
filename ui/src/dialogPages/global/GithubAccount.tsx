import { FC } from 'react';
import Loader from '../../components/organisms/Loader';
import { FormProps, useFormValidation } from '../../hooks/form/useFormValidation';
import { useMutation, useQuery } from '@apollo/client';
import LoggedUserQuery from '../../gql/queries/LoggedUserQuery';
import { LoggedUser } from '../../gql/generated/LoggedUser';
import GithubPreparationQuery from '../../gql/mutations/GithubPreparationQuery';
import GithubPreparationForm from '../../components/organisms/Forms/GithubPreparationForm';
import { PrepareGitHubLinkInput } from '../../gql/generated/globalTypes';
import { GithubPreparationValues } from '../../gql/generated/GithubPreparationValues';
import nameValidator from '../../utils/validators/nameValidator';
import { DialogPageProps } from '../../types/DialogTypes';
import { queryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import { Box, DialogActions, DialogContent } from '@mui/material';
import FormGqlError from '../../components/atoms/FormGqlError';
import GithubAccountRemoveQuery from '../../gql/mutations/GithubAccountRemoveQuery';
import { GithubAccountRemoveValues } from '../../gql/generated/GithubAccountRemoveValues';
import GithubLoginForUser from './GithubLoginForUser';
import { logError } from '../../utils/logUtils';
import { DialogConfirmButton } from '../../components/atoms/DialogConfirmButton';
import { DialogCancelButton } from '../../components/atoms/DialogCancelButton';

type GithubAccountAfterLoadProps = DialogPageProps & {
    hasLinkedSSO: boolean;
    githubUser: string | null;
};

export type GitHubPreparationValues = {
    githubUser: string;
};

export type GitHubPreparationFormProps = FormProps<GitHubPreparationValues> & {
    handleDialogClose: (checkChanges: boolean) => void;
};

const GithubAccountUseForm: FC<GithubAccountAfterLoadProps> = (
    props: GithubAccountAfterLoadProps,
) => {
    const [GithubPreparation, { loading, data, error: gqlError }] =
        useMutation<GithubPreparationValues>(GithubPreparationQuery);

    const submitForm = async (gitHubPreparationValues: GitHubPreparationValues) => {
        const prepareGitHubLinkInput: PrepareGitHubLinkInput = {
            github_user: gitHubPreparationValues.githubUser,
        };
        try {
            await GithubPreparation({
                variables: { prepareGitHubLinkInput },
            });
        } catch (error) {
            logError(error);
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

    if (loading) {
        return <Loader />;
    }

    if (data?.prepareGitHubLink.id !== undefined) {
        return <GithubLoginForUser {...props} />;
    }

    const formProps: GitHubPreparationFormProps = {
        ...formValidationValues,
        gqlError,
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
    return queryLoaderAndError<LoggedUser>(
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
