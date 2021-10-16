import { FC, MouseEvent, SyntheticEvent } from 'react';
import SideBar from '../../organisms/SideBar';
import makeStyles from '@mui/styles/makeStyles';
import { Box, Snackbar } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import CancelConfirmDialog from '../../organisms/CancelConfirmDialog';
import { MainDrawer } from '../../organisms/MainDrawer';
import { DialogBaseProps, DialogPageProps } from '../../../types/DialogTypes';
import GQLError from '../../atoms/GqlError';
import InfoDialog from '../../organisms/InfoDialog';
import PageDialog from '../../organisms/PageDialog';
import { navigationColorFromSectionLocator } from '../../../containers/SectionsDetails';
import { useLoggedInState } from '../../../context/AppContext';
import { LoggedInProps } from '../../../containers/global/LoggedInSection';
import { grey } from '@mui/material/colors';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            boxSizing: 'border-box',
            minHeight: '100vh',
        },
        main: {
            marginLeft: '50px',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            flexGrow: 1,
        },
        corner: {
            zIndex: theme.zIndex.appBar + 1,
            position: 'absolute',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '15px 15px 0 0',
            borderColor: `${theme.palette.primary.main} transparent transparent transparent`,
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            flexGrow: 1,
        },
        body: {
            display: 'flex',
            boxSizing: 'border-box',
            flex: 1,
            width: '100%',
            position: 'relative',
        },
        cornerColor: {
            zIndex: theme.zIndex.appBar,
            position: 'absolute',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '15px 15px 0 0',
        },
        sideMenuContainer: {
            '& .sideMenu': {
                width: '190px',
            },
        },
        breadcrumbContainer: {
            '& .breadcrumb': {
                padding: theme.spacing(3.5, 2, 1.5, 2),
            },
        },
        innerContainer: {
            height: '100%',
            overflowX: 'auto',
        },
    }),
);

const LoggedInTemplate: FC<LoggedInProps> = (props: LoggedInProps) => {
    const classes = useStyles();

    const { templateInteractions } = useLoggedInState();
    const {
        ask,
        dispatchDialogAction,
        dialogState,
        snackbarError,
        setSnackbarError,
        sectionHistory,
    } = templateInteractions;
    const navigationColor = navigationColorFromSectionLocator(sectionHistory.current);

    const handleDialogClose = (checkChanges: boolean) => {
        if (checkChanges && dialogState.pageHasChanges) {
            ask('Discard unsaved data?', () => {
                dispatchDialogAction({
                    type: 'close',
                });
            });
        } else {
            dispatchDialogAction({
                type: 'close',
            });
        }
    };

    const drawerProps: DialogBaseProps = {
        open: dialogState.pageComponent !== null && dialogState.type === 'drawer',
        handleDialogClose,
        width: dialogState.pageWidth ?? 432,
        secondaryPageComponent: dialogState.secondaryPageComponent,
    };

    const infoProps: DialogBaseProps = {
        open:
            dialogState.pageComponent !== null &&
            (dialogState.type === 'fullscreen' || dialogState.type === 'info'),
        handleDialogClose,
    };

    const lightboxProps: DialogBaseProps = {
        open: dialogState.pageComponent !== null && dialogState.type === 'lightbox',
        handleDialogClose,
    };

    const dialogPageProps: DialogPageProps = {
        pageRefresh:
            dialogState.refresh ??
            (() => {
                // no refresh
            }),
        handleDialogClose,
        setPageHasChanges: (pageHasChanges: boolean) => {
            dispatchDialogAction({
                type: 'setPageHasChanges',
                payload: { pageHasChanges },
            });
        },
        id: dialogState.contentId ?? '',
        contextId: dialogState.contextId ?? '',
        ids: dialogState.ids ?? [],
        followUp: dialogState.followUp,
        name: dialogState.name,
        readOnly: dialogState.readOnly === true,
    };

    const handleErrorSnackbarOpenClose = (event: SyntheticEvent | MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarError(null);
    };

    return (
        <div className={classes.root}>
            <SideBar {...props.sideBarProps} />
            <div className={classes.main}>
                <div className={classes.corner} />
                <div className={classes.content}>
                    <Box
                        flexShrink={0}
                        bgcolor={navigationColor}
                        className={classes.breadcrumbContainer}
                    >
                        {props.breadcrumb}
                    </Box>
                    <div className={classes.body}>
                        <Box
                            height="100%"
                            position="absolute"
                            width="100%"
                            overflow="hidden"
                            display="flex"
                        >
                            <Box
                                flexShrink={0}
                                bgcolor={grey['50']}
                                color="grey.800"
                                className={classes.sideMenuContainer}
                            >
                                {props.sideMenu}
                            </Box>
                            <Box
                                flexShrink={1}
                                flexGrow={1}
                                className={classes.innerContainer}
                                bgcolor="background.paper"
                            >
                                <div
                                    className={classes.cornerColor}
                                    style={{
                                        borderColor: `${navigationColor} transparent transparent transparent`,
                                    }}
                                />
                                {props.children}
                            </Box>
                        </Box>
                    </div>
                </div>
            </div>

            <CancelConfirmDialog {...props.cancelConfirmDialogProps} />

            <MainDrawer {...drawerProps}>
                {dialogState.pageComponent !== null && dialogState.type === 'drawer' && (
                    <dialogState.pageComponent {...dialogPageProps} />
                )}
            </MainDrawer>

            {dialogState.pageComponent !== null && (
                <>
                    <InfoDialog {...infoProps} fullscreen={dialogState.type === 'fullscreen'}>
                        {(dialogState.type === 'fullscreen' || dialogState.type === 'info') && (
                            <dialogState.pageComponent {...dialogPageProps} />
                        )}
                    </InfoDialog>

                    <PageDialog {...lightboxProps}>
                        {dialogState.type === 'lightbox' && (
                            <dialogState.pageComponent {...dialogPageProps} />
                        )}
                    </PageDialog>

                    {dialogState.type === 'hidden' && (
                        <dialogState.pageComponent {...dialogPageProps} />
                    )}
                </>
            )}

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={snackbarError !== null}
                onClose={handleErrorSnackbarOpenClose}
            >
                <div>
                    {snackbarError !== null && (
                        <GQLError error={snackbarError} onClose={handleErrorSnackbarOpenClose} />
                    )}
                </div>
            </Snackbar>
        </div>
    );
};

export default LoggedInTemplate;
