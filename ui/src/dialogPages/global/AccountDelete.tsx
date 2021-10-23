import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { Box, Button, DialogContent, lighten } from '@mui/material';
import DialogActionsWithCancel from '../../components/molecules/DialogActionsWithCancel';
import { useMutation } from '@apollo/client';
import Loader from '../../components/organisms/Loader';
import { DeleteAccount } from '../../gql/generated/DeleteAccount';
import DeleteAccountQuery from '../../gql/mutations/DeleteAccountQuery';
import FormGqlError from '../../components/atoms/FormGqlError';
import { useLoggedInState } from '../../context/AppContext';
import Navigate from '../../components/atoms/Next/Navigate';
import { toLogin } from '../../utils/NavigationPaths';

const AccountDelete: FC<DialogPageProps> = (props: DialogPageProps) => {
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
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '248px',
                }}
            >
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
                    sx={{
                        color: '#ffffff',
                        backgroundColor: (theme) => lighten(theme.palette.error.main, 0.4),
                        '&:hover': {
                            backgroundColor: (theme) => theme.palette.error.main,
                        },
                    }}
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
