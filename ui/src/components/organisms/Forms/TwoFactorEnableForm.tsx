import { FC } from 'react';
import { Box, DialogContent, Grid } from '@mui/material';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import FormGqlError from '../../atoms/FormGqlError';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import { TwoFactorEnableFormProps } from '../../../dialogPages/global/TwoFactorEnable';
import FormFlex from '../../atoms/FormFlex';

const TwoFactorEnableForm: FC<TwoFactorEnableFormProps> = (props: TwoFactorEnableFormProps) => {
    return (
        <Box display="flex" flexDirection="column">
            <FormFlex handleSubmit={props.handleSubmit}>
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '248px',
                    }}
                >
                    <Grid container>
                        <Grid item sm>
                            <Box ml={1}>
                                <small>
                                    Scan the QR code then enter the 6-digit code from the app to
                                    confirm.
                                    <br />
                                    <br />
                                </small>
                                <FormGqlError error={props.gqlError} fullWidth={true} />
                                <Box width={150}>
                                    <ControlledTextInput
                                        variant="outlined"
                                        name="code"
                                        label="Code"
                                        formProps={props}
                                        className="DialogFormField"
                                        required
                                        fullWidth
                                        autoFocus
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item sm>
                            <Box
                                width="100%"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                            >
                                <Box>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        alt="QR 2-Factor Code"
                                        src={`http://chart.apis.google.com/chart?chs=150x150&chld=L|0&cht=qr&chl=otpauth://totp/Scale8:${encodeURI(
                                            props.email,
                                        )}?secret=${props.secret}`}
                                    />
                                </Box>
                                <Box mt={1} fontSize={9}>
                                    key: {props.secret}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActionsWithCancel
                    disableSubmit={props.isSubmitting}
                    handleDialogClose={props.handleDialogClose}
                    confirmText={props.submitText}
                />
            </FormFlex>
        </Box>
    );
};

export default TwoFactorEnableForm;
