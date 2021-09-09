import { FC } from 'react';
import { ApolloError } from '@apollo/client';
import { Box } from '@material-ui/core';
import FormError from './FormError';
import { isAuthenticationError } from '../../utils/ErrorsUtils';
import Navigate from './Next/Navigate';
import { toLogin } from '../../utils/NavigationPaths';

type FormGqlErrorProps = {
    error: ApolloError | undefined;
    fullWidth?: boolean;
    width?: number;
};

const FormGqlError: FC<FormGqlErrorProps> = (props: FormGqlErrorProps) => {
    if (props.error === undefined) return null;

    return isAuthenticationError(props.error) ? (
        <Navigate to={toLogin} />
    ) : (
        <Box mb={2} width={props.width ?? '100%'}>
            <FormError error={props.error.message} />
        </Box>
    );
};

export default FormGqlError;
