import { makeStyles } from '@material-ui/core/styles';
import { FC, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    useTheme,
} from '@material-ui/core';
import FormError from '../../atoms/FormError';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import SignUpContainer from '../../molecules/SignUpContainer';
import Loader from '../Loader';
import Captcha from '../../atoms/Captcha';
import { SignUpFormProps } from '../../../types/props/forms/SignUpFormProps';
import Link from '../../atoms/Next/Link';

const useTagManagerStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        color: '#ffffff',
        backgroundColor: theme.palette.tagManagerColor.main,
        '&:hover': {
            color: '#ffffff',
            backgroundColor: theme.palette.tagManagerColor.main,
        },
    },
}));
const useDataManagerStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        color: '#ffffff',
        backgroundColor: theme.palette.dataManagerColor.main,
        '&:hover': {
            color: '#ffffff',
            backgroundColor: theme.palette.dataManagerColor.main,
        },
    },
}));
const useInviteStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        color: '#ffffff',
        backgroundColor: theme.palette.commonColor.main,
        '&:hover': {
            color: '#ffffff',
            backgroundColor: theme.palette.commonColor.main,
        },
    },
}));

const SignUpForm: FC<SignUpFormProps> = (props: SignUpFormProps) => {
    const { type, values, handleChange, errors, qsEmail } = props;

    const theme = useTheme();

    const setCaptchaToken = (token: string) => handleChange('CAPTCHAToken', token);

    const selectClasses = () => {
        if (type === 'tag-manager') {
            return useTagManagerStyles();
        }

        if (type === 'data-manager') {
            return useDataManagerStyles();
        }

        return useInviteStyles();
    };
    const classes = selectClasses();

    const [generatePassword, setGeneratePassword] = useState(true);

    useEffect(() => {
        if (values.newPassword !== '' && values.newPasswordConfirm !== '' && generatePassword) {
            handleChange('newPassword', '', [{ valueKey: 'newPasswordConfirm', value: '' }]);
        }
    }, [values, handleChange, generatePassword]);

    if (props.loading) {
        return (
            <SignUpContainer
                type={props.type}
                target={props.target}
                isCompleted={false}
                isPrepare={false}
            >
                <Loader />
            </SignUpContainer>
        );
    }

    if (props.success) {
        return (
            <SignUpContainer
                type={props.type}
                target={props.target}
                isCompleted={true}
                isPrepare={false}
            >
                <Box mb={2} width="100%">
                    <Box py={10}>
                        <Box fontSize={18} width="100%" textAlign="center">
                            Please <b>click the link in the email</b> we have just sent to{' '}
                            {props.email}.
                        </Box>
                        <Box pt={1} />
                        <Box fontSize={18} width="100%" textAlign="center">
                            Could this have gone to your spam folder?
                        </Box>
                    </Box>
                </Box>
            </SignUpContainer>
        );
    }

    return (
        <SignUpContainer
            type={props.type}
            target={props.target}
            isCompleted={false}
            isPrepare={false}
        >
            {props.gqlError && (
                <Box mb={2} width="100%">
                    <FormError error={props.gqlError.message} />
                </Box>
            )}
            <form className={classes.form} onSubmit={props.handleSubmit}>
                <ControlledTextInput
                    name="tempAccessCode"
                    label="Public beta access code"
                    formProps={props}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                />
                <ControlledTextInput
                    name="fullName"
                    label="Full Name"
                    formProps={props}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                />
                {type !== 'invite' && qsEmail === undefined && (
                    <ControlledTextInput
                        name="email"
                        label="Email Address"
                        formProps={props}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                    />
                )}
                {type === 'tag-manager' && (
                    <ControlledTextInput
                        name="domain"
                        label="Domain"
                        formProps={props}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                    />
                )}
                {type === 'data-manager' && (
                    <ControlledTextInput
                        name="orgName"
                        label="Organization name"
                        formProps={props}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                    />
                )}
                {!generatePassword && (
                    <>
                        <ControlledTextInput
                            name="newPassword"
                            label="New Password"
                            formProps={props}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            inputProps={{
                                autoComplete: 'new-password',
                            }}
                            type="password"
                        />
                        <ControlledTextInput
                            name="newPasswordConfirm"
                            label="Confirm New Password"
                            formProps={props}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            inputProps={{
                                autoComplete: 'new-password',
                            }}
                            type="password"
                        />
                    </>
                )}
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={generatePassword}
                                onChange={() => {
                                    setGeneratePassword(!generatePassword);
                                }}
                                size="medium"
                                name="generatePassword"
                            />
                        }
                        label="Auto-generate secure password"
                    />
                </FormGroup>
                <FormControl error={errors['agree'] !== undefined}>
                    <FormGroup>
                        <FormControlLabel
                            color={theme.palette.error.main}
                            // error={errors['agree']}
                            control={
                                <Checkbox
                                    checked={values.agree}
                                    onChange={() => handleChange('agree', !values.agree)}
                                    size="medium"
                                    name="agree"
                                />
                            }
                            label={
                                <span
                                    style={
                                        errors['agree'] === undefined
                                            ? {}
                                            : {
                                                  color: theme.palette.error.main,
                                              }
                                    }
                                >
                                    I agree to the{' '}
                                    <Link
                                        href={'https://scale8.com/legal/terms'}
                                        style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                                    >
                                        Terms of Service
                                    </Link>
                                </span>
                            }
                        />
                    </FormGroup>
                    {errors['agree'] !== undefined && (
                        <FormHelperText>{errors['agree']}</FormHelperText>
                    )}
                </FormControl>
                <Box mt={2} />
                <FormControl error={errors['CAPTCHAToken'] !== undefined}>
                    <Captcha captcha={props.captcha} setCaptchaToken={setCaptchaToken} />
                    {errors['CAPTCHAToken'] !== undefined && (
                        <FormHelperText>{errors['CAPTCHAToken']}</FormHelperText>
                    )}
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className={classes.submit}
                    disabled={props.isSubmitting}
                >
                    {props.submitText}
                </Button>
            </form>
        </SignUpContainer>
    );
};

export default SignUpForm;
