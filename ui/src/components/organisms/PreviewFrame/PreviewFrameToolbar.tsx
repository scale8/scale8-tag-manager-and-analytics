import { FC, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, CircularProgress, IconButton, Typography, useTheme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PreviewSelectIcon from '../../atoms/Icons/PreviewSelectIcon';
import PreviewHighlightIcon from '../../atoms/Icons/PreviewHighlightIcon';
import clsx from 'clsx';
import TmLogo from '../../atoms/TmLogo';
import PreviewCloseIcon from '../../atoms/Icons/PreviewCloseIcon';
import StorageIcon from '@material-ui/icons/Storage';
import WarningIcon from '@material-ui/icons/Warning';
import { previewFrameContext } from '../../../context/PreviewFrameContext';

const useStyles = makeStyles((theme) => ({
    toolbar: {
        fontSize: '0.5em',
    },
    appBar: {
        position: 'absolute',
        borderTop: '1px solid #dadada',
        borderBottom: '1px solid #dadada',
        backgroundColor: '#fafafa',
        color: '#4c5053',
    },
    revisionName: {
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    selectedButton: {
        color: theme.palette.tagManagerColor.main,
    },
    margin: {
        margin: '8px',
    },
}));

const PreviewFrameToolbar: FC = () => {
    const theme = useTheme();
    const classes = useStyles();
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
        <AppBar position="static" elevation={0} className={classes.appBar}>
            <Toolbar variant="dense" className={classes.toolbar} disableGutters>
                <Box pt="3px" pl={2} pr={3}>
                    <TmLogo height={25} />
                </Box>
                <Box flexGrow={1} display="flex">
                    {previewFrameData === undefined ? (
                        !hasError && <CircularProgress color="inherit" size={20} />
                    ) : (
                        <Box
                            className={classes.revisionName}
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
                            style={{
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
                        style={{
                            backgroundColor: 'transparent',
                            color: theme.palette.error.main,
                            marginRight: '8px',
                        }}
                    >
                        <WarningIcon />
                    </IconButton>
                )}
                <IconButton
                    color="inherit"
                    size="small"
                    className={classes.margin}
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
                    className={classes.margin}
                    onClick={flashTag}
                    disabled={currentTagCode === undefined || hasError}
                >
                    <PreviewSelectIcon fontSize="small" />
                </IconButton>
                <div className={clsx(highlightEnabled && classes.selectedButton)}>
                    <IconButton
                        color="inherit"
                        size="small"
                        className={classes.margin}
                        onClick={toggleHighlight}
                    >
                        <PreviewHighlightIcon fontSize="small" />
                    </IconButton>
                </div>
                <IconButton
                    color="inherit"
                    size="small"
                    className={classes.margin}
                    onClick={handleClose}
                >
                    <PreviewCloseIcon fontSize="small" />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export { PreviewFrameToolbar };
