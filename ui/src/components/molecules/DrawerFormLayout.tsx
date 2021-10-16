import makeStyles from '@mui/styles/makeStyles';
import { FC, ReactNode } from 'react';
import { Box, Button } from '@mui/material';
import FormGqlError from '../atoms/FormGqlError';
import { InfoButton } from './InfoButton';
import { MainDrawerTitle } from './MainDrawerTitle';
import { FormCommonProps } from '../../types/props/forms/CommonFormProps';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        '& .DrawerFormField': {
            width: '100%',
            margin: theme.spacing(0, 0, 3),
        },
    },
    submit: {
        margin: theme.spacing(4, 0, 2),
    },
}));

type DrawerFormLayoutProps = FormCommonProps & {
    children?: ReactNode;
    submitDisable?: boolean;
    noTitle?: boolean;
    noSubmit?: boolean;
    handleDialogClose: (checkChanges: boolean) => void;
};

const DrawerFormLayout: FC<DrawerFormLayoutProps> = (props: DrawerFormLayoutProps) => {
    const classes = useStyles();

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            {!props.noTitle && (
                <MainDrawerTitle handleDialogClose={props.handleDialogClose}>
                    {props.title}
                    {props.formInfoProps !== undefined && <InfoButton {...props.formInfoProps} />}
                </MainDrawerTitle>
            )}
            <Box flex={1} position="relative" width="100%">
                <Box p={3} height="100%" width="100%" position="absolute" overflow="auto">
                    <FormGqlError error={props.gqlError} />
                    <form className={classes.form} onSubmit={props.handleSubmit}>
                        {props.children}
                        {!props.noSubmit && (
                            <Box display="Flex" justifyContent="flex-end">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    disabled={
                                        props.submitDisable === undefined
                                            ? props.isSubmitting
                                            : props.submitDisable
                                    }
                                >
                                    {props.submitText}
                                </Button>
                            </Box>
                        )}
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default DrawerFormLayout;
