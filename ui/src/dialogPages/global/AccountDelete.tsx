import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { Box, Button, DialogContent, lighten } from '@mui/material';
import DialogActionsWithCancel from '../../components/molecules/DialogActionsWithCancel';
import makeStyles from '@mui/styles/makeStyles';
import { useMutation } from '@apollo/client';
import Loader from '../../components/organisms/Loader';
import { DeleteAccount } from '../../gql/generated/DeleteAccount';
import DeleteAccountQuery from '../../gql/mutations/DeleteAccountQuery';
import FormGqlError from '../../components/atoms/FormGqlError';
import { useLoggedInState } from '../../context/AppContext';
import Navigate from '../../components/atoms/Next/Navigate';
import { toLogin } from '../../utils/NavigationPaths';

const useStyles = makeStyles((theme) => ({
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '248px',
    },
    deleteButton: {
        color: '#ffffff',
        backgroundColor: lighten(theme.palette.error.main, 0.4),
        '&:hover': {
            backgroundColor: theme.palette.error.main,
        },
    },
}));

const AccountDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
    const classes = useStyles();
    const { templateInteractions } = useLoggedInState();
    const { ask } = templateInteractions;
    const { handleDialogClose } = props;

    const [deleteAccount, { loading, data, error: gqlError }] =
        useMutation<DeleteAccount>(DeleteAccountQuery);

    const successfullySubmitted = data?.deleteMe;

    if (successfullySubmitted) {
        localStorage.removeItem('uid');
        localStorage.removeItem('token');

        handleDialogClose(false);
        return <Navigate to={toLogin} />;
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <Box display="flex" flexDirection="column">
            <DialogContent className={classes.dialogContent}>
                <FormGqlError error={gqlError} />
                <small>
                    If you delete your account you will be a automatically removed from all
                    organizations.
                    <br />
                    <br />
                    If you are the owner of an organization you cannot delete your account. you must
                    first transfer the ownership or remove the organization.
                    <br />
                    <br />
                </small>
                <Button
                    variant="contained"
                    onClick={() => {
                        ask(`Are you sure you want to delete your account?`, () => {
                            (async () => {
                                await deleteAccount();
                            })();
                        });
                    }}
                    className={classes.deleteButton}
                    disableElevation
                >
                    Delete Account
                </Button>
            </DialogContent>
            <DialogActionsWithCancel handleDialogClose={props.handleDialogClose} />
        </Box>
    );
};

export { AccountDelete };
