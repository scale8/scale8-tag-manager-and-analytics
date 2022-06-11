import { FC } from 'react';
import SideBar from '../../organisms/SideBar';
import { Box, Snackbar } from '@mui/material';
import CancelConfirmDialog from '../../organisms/CancelConfirmDialog';
import { MainDrawer } from '../../organisms/MainDrawer';
import { DialogBaseProps, DialogPageProps } from '../../../types/DialogTypes';
import GQLError from '../../atoms/GqlError';
import InfoDialog from '../../organisms/InfoDialog';
import PageDialog from '../../organisms/PageDialog';
import { useLoggedInState } from '../../../context/AppContext';
import { LoggedInProps } from '../../../containers/global/LoggedInSection';

const LoggedInTemplate: FC<LoggedInProps> = (props: LoggedInProps) => {
    const { templateInteractions } = useLoggedInState();
    const { ask, dispatchDialogAction, dialogState, snackbarError, setSnackbarError } =
        templateInteractions;

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

    const handleErrorSnackbarOpenClose = (event: any, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarError(null);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                boxSizing: 'border-box',
                minHeight: '100vh',
            }}
        >
            <SideBar {...props.sideBarProps}>
                <Box
                    flexShrink={0}
                    sx={{
                        '& .sideMenu': {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '50px',
                        },
                    }}
                >
                    {props.sideMenu}
                </Box>
            </SideBar>
            <Box
                sx={{
                    marginLeft: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    flexGrow: 1,
                }}
            >
                <Box
                    sx={{
                        zIndex: (theme) => theme.zIndex.appBar + 1,
                        backgroundColor: 'black',
                        position: 'absolute',
                        width: '15px',
                        height: '15px',
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            width: '15px',
                            height: '15px',
                            borderTopLeftRadius: '15px',
                            transform: 'translateZ(0)', // Safari border radius fix
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        boxSizing: 'border-box',
                        flexGrow: 1,
                    }}
                >
                    {props.breadcrumb}
                    <Box
                        sx={{
                            display: 'flex',
                            boxSizing: 'border-box',
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        <Box
                            sx={{
                                zIndex: 20,
                                display: 'flex',
                                height: 15,
                                backgroundImage: 'linear-gradient(to bottom, white, transparent)',
                                width: 'calc( 100% - 32px)',
                                position: 'absolute',
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            boxSizing: 'border-box',
                            flex: 1,
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        <Box
                            height="100%"
                            position="absolute"
                            width="100%"
                            sx={{
                                overflowX: 'auto',
                            }}
                            pt="15px"
                            bgcolor="background.paper"
                            flexShrink={1}
                            flexGrow={1}
                        >
                            {props.children}
                        </Box>
                    </Box>
                </Box>
            </Box>

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
        </Box>
    );
};

export default LoggedInTemplate;
