import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import { useEffect } from 'react';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getApiUrl } from '../utils/ConfigUtils';
import AppWrapper from '../context/AppWrapper';

const httpLink = createHttpLink({
    uri: `${getApiUrl()}/graphql`,
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const uid = localStorage.getItem('uid');
    const token = localStorage.getItem('token');
    if (!token) return headers;
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            uid,
            token,
        },
    };
});

const client = new ApolloClient({
    cache: new InMemoryCache({
        typePolicies: {
            GroupingCountsResponse: {
                merge: false,
            },
            UserSession: {
                keyFields: ['token'],
            },
            TempSession: {
                keyFields: ['temp_token'],
            },
        },
    }),
    link: authLink.concat(httpLink),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'all',
            pollInterval: 0,
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});

// noinspection JSUnusedGlobalSymbols
export default function MyApp(props: AppProps) {
    const { Component, pageProps } = props;

    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement?.removeChild(jssStyles);
        }
    }, []);

    return (
        <>
            <Head>
                <title>Scale8</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />

                    <ApolloProvider client={client}>
                        <AppWrapper>
                            <Component {...pageProps} />
                        </AppWrapper>
                    </ApolloProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </>
    );
}
