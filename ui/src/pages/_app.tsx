import theme from '../theme';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getApiUrl } from '../utils/ConfigUtils';
import AppWrapper from '../context/AppWrapper';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../createEmotionCache';

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

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

// noinspection JSUnusedGlobalSymbols
export default function MyApp(props: MyAppProps) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>Scale8</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <ApolloProvider client={client}>
                    <AppWrapper>
                        <Component {...pageProps} />
                    </AppWrapper>
                </ApolloProvider>
            </ThemeProvider>
        </CacheProvider>
    );
}
