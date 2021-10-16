import { FC, useEffect, useState } from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import clsx from 'clsx';
import CssBaseline from '@mui/material/CssBaseline';
import { useParams } from '../hooks/useParams';
import { frameEventFromMessage, messageFromFrameEvent } from '../utils/FrameEventUtils';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

const useStyles = makeStyles(() =>
    createStyles({
        flashing: {},
        root: {
            width: '100%',
            height: '100%',
            flexGrow: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            border: '4px solid rgba(0, 0, 0, 0.12)',
            cursor: 'pointer',
            '&:hover, &$flashing': {
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                border: '4px solid rgba(0, 0, 0, 0.25)',
            },
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
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
                    backgroundColor: 'transparent',
                },
            },
        },
    },
});

const DebugHighlighter: FC = () => {
    const classes = useStyles();
    const { code, index } = useParams();
    const [flashing, setFlashing] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener('message', function (e) {
            const frameEvent = frameEventFromMessage(e.data);
            if (frameEvent !== null && frameEvent.event === 'flash') {
                setFlashing(true);
                const timer = setTimeout(() => {
                    setFlashing(false);
                    parent.postMessage(
                        messageFromFrameEvent('flashed', {
                            code,
                            index: parseInt(index ?? ''),
                            hide: frameEvent.payload.fromHidden,
                        }),
                        '*',
                    );
                }, 500);
                return () => clearTimeout(timer);
            }
        });
    }, []);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div
                    className={clsx(classes.root, flashing && classes.flashing)}
                    onClick={() =>
                        parent.postMessage(
                            messageFromFrameEvent('highlighterClick', {
                                code,
                                index: parseInt(index ?? ''),
                            }),
                            '*',
                        )
                    }
                />
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default DebugHighlighter;
