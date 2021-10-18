import { FC, useContext } from 'react';
import { Theme } from '@mui/material/styles';
import { Box, ThemeProvider, StyledEngineProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { PreviewFrameToolbar } from '../organisms/PreviewFrame/PreviewFrameToolbar';
import { PreviewFrameTagList } from '../organisms/PreviewFrame/PreviewFrameTagList';
import { PreviewFrameMain } from '../organisms/PreviewFrame/PreviewFrameMain';
import GqlError from '../atoms/GqlError';
import { isAuthenticationError } from '../../utils/ErrorsUtils';
import Alert from '@mui/material/Alert';
import { ApolloError } from '@apollo/client/errors';
import { previewFrameContext } from '../../context/PreviewFrameContext';
import Link from '../atoms/Next/Link';

const theme = (outerTheme: Theme) => ({
    ...outerTheme,
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                'html, body, div#root, div#__next': {
                    height: '100%',
                },
            },
        },
    },
});

const PreviewBodyError: FC<{ error: ApolloError }> = (props: { error: ApolloError }) => {
    const isLocalStorageAccessible = (): boolean => {
        try {
            return typeof window.localStorage !== 'undefined';
        } catch (e) {
            return false;
        }
    };

    if (!isLocalStorageAccessible()) {
        return (
            <Box width="100%">
                <Alert severity="warning">
                    Cookie blocking must be disabled to preview the revision.
                </Alert>
            </Box>
        );
    } else if (isAuthenticationError(props.error)) {
        return (
            <Box width="100%">
                <Alert severity="warning">
                    You must be{' '}
                    <Link
                        sx={{ textDecoration: 'underline' }}
                        href={'/login'}
                        color="inherit"
                        target="_blank"
                    >
                        logged in
                    </Link>{' '}
                    to preview the revision.
                </Alert>
            </Box>
        );
    } else {
        return (
            <Box width="100%">
                <GqlError error={props.error} />
            </Box>
        );
    }
};

const PreviewMainBody: FC = () => {
    const { previewFrameError } = useContext(previewFrameContext);

    if (previewFrameError === undefined) {
        return (
            <Box width="100%" height="100%" display="flex" pt="50px">
                <PreviewFrameTagList />
                <PreviewFrameMain />
            </Box>
        );
    } else {
        return (
            <Box width="100%" height="100%" display="flex" px={2} pt="58px">
                <PreviewBodyError error={previewFrameError} />
            </Box>
        );
    }
};

const PreviewLayout: FC = () => {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box
                    sx={{
                        height: '100%',
                        flexGrow: 1,
                    }}
                >
                    <PreviewFrameToolbar />
                    <PreviewMainBody />
                </Box>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default PreviewLayout;
