import makeStyles from '@mui/styles/makeStyles';
import { FC } from 'react';
import { Box, DialogContent } from '@mui/material';
import CopyBlock from '../../atoms/CopyBlock';
import Alert from '@mui/material/Alert';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { APITokenFormProps } from '../../../dialogPages/global/APIToken';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    submit: {
        margin: theme.spacing(4, 0, 2),
    },
    dialogContent: {
        minHeight: '248px',
    },
}));

const APITokenForm: FC<APITokenFormProps> = (props: APITokenFormProps) => {
    const classes = useStyles();

    return (
        <Box display="flex" flexDirection="column">
            <form className={classes.form} onSubmit={props.handleSubmit}>
                <DialogContent className={classes.dialogContent}>
                    <Box fontSize={12} color="#0000008a">
                        User ID:
                    </Box>
                    <Box mb={1}>
                        <CopyBlock text={props.uid} language="html" flat />
                    </Box>
                    <Box fontSize={12} color="#0000008a">
                        API Token:
                    </Box>
                    <Box mb={1}>
                        <CopyBlock text={props.token} language="html" flat />
                    </Box>
                    <Box mt={3}>
                        <Alert severity="error" style={{ fontSize: '12px' }}>
                            Changing your token will impact any existing API integrations. Please
                            make sure you update your API integrations with your new token.
                        </Alert>
                    </Box>
                </DialogContent>
                <DialogActionsWithCancel
                    handleDialogClose={props.handleDialogClose}
                    confirmText="Refresh Token"
                />
            </form>
        </Box>
    );
};

export default APITokenForm;
