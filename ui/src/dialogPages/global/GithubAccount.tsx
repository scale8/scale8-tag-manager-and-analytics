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
import { Box, Button, DialogActions, DialogContent, lighten } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { grey } from '@mui/material/colors';
import FormGqlError from '../../components/atoms/FormGqlError';
import GithubAccountRemoveQuery from '../../gql/mutations/GithubAccountRemoveQuery';
import { GithubAccountRemoveValues } from '../../gql/generated/GithubAccountRemoveValues';
import GithubLoginForUser from './GithubLoginForUser';
import { logError } from '../../utils/logUtils';

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

const useStyles = makeStyles((theme) =>
    createStyles({
        dialogActions: {
            padding: theme.spacing(2),
            justifyContent: 'center',
        },
        cancel: {
            color: theme.palette.getContrastText(grey[700]),
            backgroundColor: grey[500],
            '&:hover': {
                backgroundColor: grey[700],
            },
        },
        confirm: {
            color: theme.palette.getContrastText('#0096a6'),
            backgroundColor: lighten('#0096a6', 0.4),
            '&:hover': {
                backgroundColor: '#0096a6',
            },
        },
    }),
);

const RemoveGithubAccountUseForm: FC<GithubAccountAfterLoadProps> = (
    props: GithubAccountAfterLoadProps,
) => {
    const classes = useStyles();

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
            <DialogContent style={{ minHeight: 248 }}>
                <FormGqlError error={gqlError} />
                This account is connected to the github account:
                <br />
                <b>{props.githubUser}</b>
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <Button onClick={() => props.handleDialogClose(false)} className={classes.cancel}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        (async () => {
                            try {
                                await GithubAccountRemove();
                            } catch (error) {
                                logError(error);
                            }
                        })();
                    }}
                    className={classes.confirm}
                >
                    Disconnect Github Account
                </Button>
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
