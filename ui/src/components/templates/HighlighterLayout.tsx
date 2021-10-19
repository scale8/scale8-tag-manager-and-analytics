import { FC } from 'react';
import { Box, StyledEngineProvider, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Theme } from '@mui/material/styles';
import { messageFromFrameEvent } from '../../utils/FrameEventUtils';

const theme = (outerTheme: Theme) => ({
    ...outerTheme,
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                'html, body, div#root, div#__next': {
                    height: '100%',
                    backgroundColor: 'transparent',
                },
            },
        },
    },
});

const HighlighterLayout: FC<{ code?: string; index?: string; flashing: boolean }> = ({
    code,
    index,
    flashing,
}) => {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        flexGrow: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        border: '4px solid rgba(0, 0, 0, 0.12)',
                        cursor: 'pointer',
                        '&:hover, &.flashing': {
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            border: '4px solid rgba(0, 0, 0, 0.25)',
                        },
                        transition: 'background-color 0.3s ease, border-color 0.3s ease',
                    }}
                    className={flashing ? 'flashing' : undefined}
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

export default HighlighterLayout;
