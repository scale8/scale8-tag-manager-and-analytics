import { FC, useContext } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { PreviewFrameToolbar } from '../organisms/PreviewFrame/PreviewFrameToolbar';
import { PreviewFrameTagList } from '../organisms/PreviewFrame/PreviewFrameTagList';
import { PreviewFrameMain } from '../organisms/PreviewFrame/PreviewFrameMain';
import GqlError from '../atoms/GqlError';
import { isAuthenticationError } from '../../utils/ErrorsUtils';
import Alert from '@material-ui/lab/Alert';
import { ApolloError } from '@apollo/client/errors';
import { previewFrameContext } from '../../context/PreviewFrameContext';
import Link from '../atoms/Next/Link';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            height: '100%',
            flexGrow: 1,
        },
    }),
);

const theme = (outerTheme: Theme) => ({
    ...outerTheme,
    overrides: {
        MuiCssBaseline: {
            '@global': {
                'html, body, div#root': {
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
                        style={{ textDecoration: 'underline' }}
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
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <style global jsx>{`
                div#__next {
                    height: 100%;
                }
            `}</style>
            <div className={classes.root}>
                <PreviewFrameToolbar />
                <PreviewMainBody />
            </div>
        </ThemeProvider>
    );
};

export default PreviewLayout;
