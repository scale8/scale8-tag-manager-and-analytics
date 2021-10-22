import { FC } from 'react';
import { Box, DialogContent } from '@mui/material';
import CopyBlock from '../../atoms/CopyBlock';
import Alert from '@mui/material/Alert';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { APITokenFormProps } from '../../../dialogPages/global/APIToken';
import FormFlex from '../../atoms/FormFlex';

const APITokenForm: FC<APITokenFormProps> = (props: APITokenFormProps) => {
    return (
        <Box display="flex" flexDirection="column">
            <FormFlex handleSubmit={props.handleSubmit}>
                <DialogContent
                    sx={{
                        minHeight: '248px',
                    }}
                >
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
                        <Alert severity="error" sx={{ fontSize: '12px' }}>
                            Changing your token will impact any existing API integrations. Please
                            make sure you update your API integrations with your new token.
                        </Alert>
                    </Box>
                </DialogContent>
                <DialogActionsWithCancel
                    handleDialogClose={props.handleDialogClose}
                    confirmText="Refresh Token"
                />
            </FormFlex>
        </Box>
    );
};

export default APITokenForm;
