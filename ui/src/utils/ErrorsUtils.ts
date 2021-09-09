import { ApolloError } from '@apollo/client';

const isAuthenticationError = (error: ApolloError): boolean => {
    if (!error.graphQLErrors || error.graphQLErrors.length < 1) {
        return false;
    }

    const firstError = error.graphQLErrors[0];
    if (!firstError.extensions || !firstError.extensions.code) {
        return false;
    }
    return firstError.extensions.code === 'AuthenticationError';
};

export { isAuthenticationError };
