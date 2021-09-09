import { PageActionProps } from '../actions/PageActions';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

export const openDrawer = (
    pageActionProps: PageActionProps,
    pageComponent: FC<DialogPageProps>,
    contentId?: string,
    mustResetTable = true,
    mustResetCache = false,
    contextId?: string,
    pageWidth?: number,
    followUp?: (
        id: string,
        pageRefresh: () => void,
        handleDialogClose: (checkChanges: boolean) => void,
    ) => void,
    name?: string,
    readOnly?: boolean,
): void => {
    pageActionProps.dispatchDialogAction({
        type: 'openDrawer',
        payload: {
            pageComponent,
            refresh: () => {
                if (pageActionProps.refresh !== undefined) {
                    pageActionProps.refresh(mustResetTable, mustResetCache);
                }
            },
            ...(contentId === undefined ? {} : { contentId }),
            ...(contextId === undefined ? {} : { contextId }),
            ...(pageWidth === undefined ? {} : { pageWidth }),
            ...(followUp === undefined ? {} : { followUp }),
            ...(name === undefined ? {} : { name }),
            ...(readOnly === undefined ? {} : { readOnly }),
        },
    });
};

export const openWideDrawer = (
    pageActionProps: PageActionProps,
    pageComponent: FC<DialogPageProps>,
    contentId?: string,
    mustResetTable = true,
    mustResetCache = false,
    contextId?: string,
    followUp?: (
        id: string,
        pageRefresh: () => void,
        handleDialogClose: (checkChanges: boolean) => void,
    ) => void,
    name?: string,
    readOnly?: boolean,
): void => {
    openDrawer(
        pageActionProps,
        pageComponent,
        contentId,
        mustResetTable,
        mustResetCache,
        contextId,
        680,
        followUp,
        name,
        readOnly,
    );
};

export const openDrawerContextOnly = (
    pageActionProps: PageActionProps,
    pageComponent: FC<DialogPageProps>,
    contextId?: string,
    mustResetTable = true,
    mustResetCache = false,
    pageWidth?: number,
    followUp?: (
        id: string,
        pageRefresh: () => void,
        handleDialogClose: (checkChanges: boolean) => void,
    ) => void,
    name?: string,
    readOnly?: boolean,
): void => {
    openDrawer(
        pageActionProps,
        pageComponent,
        undefined,
        mustResetTable,
        mustResetCache,
        contextId,
        pageWidth,
        followUp,
        name,
        readOnly,
    );
};

export const openWideDrawerContextOnly = (
    pageActionProps: PageActionProps,
    pageComponent: FC<DialogPageProps>,
    contextId?: string,
    mustResetTable = true,
    mustResetCache = false,
    followUp?: (
        id: string,
        pageRefresh: () => void,
        handleDialogClose: (checkChanges: boolean) => void,
    ) => void,
    name?: string,
    readOnly?: boolean,
): void => {
    openDrawer(
        pageActionProps,
        pageComponent,
        undefined,
        mustResetTable,
        mustResetCache,
        contextId,
        680,
        followUp,
        name,
        readOnly,
    );
};

export const openNoRefreshDrawer = (
    pageActionProps: PageActionProps,
    pageComponent: FC<DialogPageProps>,
    contentId?: string,
    contextId?: string,
    pageWidth?: number,
    followUp?: (
        id: string,
        pageRefresh: () => void,
        handleDialogClose: (checkChanges: boolean) => void,
    ) => void,
): void => {
    pageActionProps.dispatchDialogAction({
        type: 'openDrawer',
        payload: {
            pageComponent,
            refresh: () => {
                // No refresh needed
            },
            ...(contentId === undefined ? {} : { contentId }),
            ...(contextId === undefined ? {} : { contextId }),
            ...(pageWidth === undefined ? {} : { pageWidth }),
            ...(followUp === undefined ? {} : { followUp }),
        },
    });
};

export const openLightbox = (
    pageActionProps: PageActionProps,
    pageComponent: FC<DialogPageProps>,
    contentId?: string,
    mustResetTable = true,
    mustResetCache = false,
    contextId?: string,
    followUp?: (
        id: string,
        pageRefresh: () => void,
        handleDialogClose: (checkChanges: boolean) => void,
    ) => void,
): void => {
    pageActionProps.dispatchDialogAction({
        type: 'openLightbox',
        payload: {
            pageComponent,
            contentId,
            refresh: () => {
                if (pageActionProps.refresh !== undefined) {
                    pageActionProps.refresh(mustResetTable, mustResetCache);
                }
            },
            ...(contentId === undefined ? {} : { contentId }),
            ...(contextId === undefined ? {} : { contextId }),
            ...(followUp === undefined ? {} : { followUp }),
        },
    });
};

export const openLightboxWithName = (
    pageActionProps: PageActionProps,
    pageComponent: FC<DialogPageProps>,
    contentId: string,
    name: string,
    mustResetTable = true,
    mustResetCache = false,
    contextId?: string,
    pageWidth?: number,
): void => {
    pageActionProps.dispatchDialogAction({
        type: 'openLightbox',
        payload: {
            pageComponent,
            contentId,
            refresh: () => {
                if (pageActionProps.refresh !== undefined) {
                    pageActionProps.refresh(mustResetTable, mustResetCache);
                }
            },
            name,
            ...(contextId === undefined ? {} : { contextId }),
            ...(pageWidth === undefined ? {} : { pageWidth }),
        },
    });
};

export const openLightboxNoRefresh = (
    pageActionProps: PageActionProps,
    pageComponent: FC<DialogPageProps>,
    contentId?: string,
    contextId?: string,
    pageWidth?: number,
): void => {
    pageActionProps.dispatchDialogAction({
        type: 'openLightbox',
        payload: {
            pageComponent,
            contentId,
            refresh: () => {
                // no need to refresh
            },
            ...(contentId === undefined ? {} : { contentId }),
            ...(contextId === undefined ? {} : { contextId }),
            ...(pageWidth === undefined ? {} : { pageWidth }),
        },
    });
};

export const launchHidden = (
    pageActionProps: PageActionProps,
    pageComponent: FC<DialogPageProps>,
    contentId: string,
    ids?: string[],
    contextId?: string,
    mustResetTable = true,
    mustResetCache = true,
    overrideRefresh?: () => void,
): void => {
    pageActionProps.dispatchDialogAction({
        type: 'launchHidden',
        payload: {
            pageComponent,
            contentId,
            refresh:
                overrideRefresh === undefined
                    ? () => {
                          if (pageActionProps.refresh !== undefined) {
                              pageActionProps.refresh(mustResetTable, mustResetCache);
                          }
                      }
                    : overrideRefresh,
            ...(ids === undefined ? {} : { ids }),
            ...(contextId === undefined ? {} : { contextId }),
        },
    });
};

export const openInfo = (
    pageActionProps: PageActionProps,
    pageComponent: FC<DialogPageProps>,
    contentId: string,
    name?: string,
    contextId?: string,
): void => {
    pageActionProps.dispatchDialogAction({
        type: 'openInfo',
        payload: {
            pageComponent,
            contentId,
            refresh: () => {
                // no need to refresh
            },
            ...(contextId === undefined ? {} : { contextId }),
            ...(name === undefined ? {} : { name }),
        },
    });
};

export const openFullScreen = (
    pageActionProps: PageActionProps,
    pageComponent: FC<DialogPageProps>,
    contentId: string,
    contextId?: string,
    mustResetTable = true,
    mustResetCache = true,
): void => {
    pageActionProps.dispatchDialogAction({
        type: 'openFullscreen',
        payload: {
            pageComponent,
            contentId,
            refresh: () => {
                if (pageActionProps.refresh !== undefined) {
                    pageActionProps.refresh(mustResetTable, mustResetCache);
                }
            },
            ...(contextId === undefined ? {} : { contextId }),
        },
    });
};

export const openFullScreenNoRefresh = (
    pageActionProps: PageActionProps,
    pageComponent: FC<DialogPageProps>,
    contentId: string,
    contextId?: string,
): void => {
    pageActionProps.dispatchDialogAction({
        type: 'openFullscreen',
        payload: {
            pageComponent,
            contentId,
            refresh: () => {
                // no need to refresh
            },
            ...(contextId === undefined ? {} : { contextId }),
        },
    });
};
