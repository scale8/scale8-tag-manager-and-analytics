import { FC, useContext } from 'react';
import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import PreviewSelectIcon from '../../atoms/Icons/PreviewSelectIcon';
import PreviewHighlightIcon from '../../atoms/Icons/PreviewHighlightIcon';
import TmLogo from '../../atoms/TmLogo';
import PreviewCloseIcon from '../../atoms/Icons/PreviewCloseIcon';
import StorageIcon from '@mui/icons-material/Storage';
import WarningIcon from '@mui/icons-material/Warning';
import { previewFrameContext } from '../../../context/PreviewFrameContext';

const PreviewFrameToolbar: FC = () => {
    const {
        previewFrameData,
        currentTagCode,
        setCurrentTagCode,
        setRevisionTab,
        highlightEnabled,
        toggleHighlight,
        flashTag,
        handleClose,
        handleLeaveDebugMode,
        previewFrameError,
        revisionStatus,
    } = useContext(previewFrameContext);

    const hasError = previewFrameError !== undefined;

    const errors = revisionStatus?.log.filter((_) => _.isError) ?? [];

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                position: 'absolute',
                borderTop: '1px solid #dadada',
                borderBottom: '1px solid #dadada',
                backgroundColor: '#fafafa',
                color: '#4c5053',
            }}
        >
            <Toolbar variant="dense" sx={{ fontSize: '0.5em' }} disableGutters>
                <Box pt="3px" pl={2} pr={3}>
                    <TmLogo height={25} />
                </Box>
                <Box flexGrow={1} display="flex">
                    {previewFrameData === undefined ? (
                        !hasError && <CircularProgress color="inherit" size={20} />
                    ) : (
                        <Box
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                            onClick={() => {
                                setCurrentTagCode(undefined);
                                setRevisionTab(1);
                            }}
                        >
                            <Typography>
                                {previewFrameData.getApp.name}
                                {' - '}
                                {previewFrameData.getRevision.name}
                            </Typography>
                        </Box>
                    )}
                    <Box textAlign="center" flexGrow={1}>
                        <Button
                            variant="outlined"
                            size="small"
                            color="inherit"
                            onClick={handleLeaveDebugMode}
                            sx={{
                                fontSize: '13px',
                                padding: '0px 20px',
                                textTransform: 'none',
                            }}
                        >
                            Leave Debug Mode
                        </Button>
                    </Box>
                </Box>
                {errors.length > 0 && (
                    <IconButton
                        size="small"
                        disableRipple
                        onClick={() => {
                            setCurrentTagCode(undefined);
                            setRevisionTab(3);
                        }}
                        sx={{
                            backgroundColor: 'transparent',
                            color: (theme) => theme.palette.error.main,
                            marginRight: '8px',
                        }}
                    >
                        <WarningIcon />
                    </IconButton>
                )}
                <IconButton
                    color="inherit"
                    size="small"
                    sx={{ margin: '8px' }}
                    onClick={() => {
                        setCurrentTagCode(undefined);
                        setRevisionTab(0);
                    }}
                >
                    <StorageIcon fontSize="small" />
                </IconButton>
                <IconButton
                    color="inherit"
                    size="small"
                    sx={{ margin: '8px' }}
                    onClick={flashTag}
                    disabled={currentTagCode === undefined || hasError}
                >
                    <PreviewSelectIcon fontSize="small" />
                </IconButton>
                <Box
                    sx={{
                        color: (theme) =>
                            highlightEnabled ? theme.palette.tagManagerColor.main : undefined,
                    }}
                >
                    <IconButton
                        color="inherit"
                        size="small"
                        sx={{ margin: '8px' }}
                        onClick={toggleHighlight}
                    >
                        <PreviewHighlightIcon fontSize="small" />
                    </IconButton>
                </Box>
                <IconButton
                    color="inherit"
                    size="small"
                    sx={{ margin: '8px' }}
                    onClick={handleClose}
                >
                    <PreviewCloseIcon fontSize="small" />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export { PreviewFrameToolbar };
