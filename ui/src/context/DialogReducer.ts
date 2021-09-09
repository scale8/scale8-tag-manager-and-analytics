import { dialogInit, DialogPayload, DialogState } from './LoggedInState';

export type DialogAction = {
    type:
        | 'close'
        | 'openSecondary'
        | 'closeSecondary'
        | 'openDrawer'
        | 'openLightbox'
        | 'openFullscreen'
        | 'launchHidden'
        | 'setPageHasChanges'
        | 'openInfo';
    payload?: DialogPayload;
};

export const dialogReducer = (state: DialogState, action: DialogAction): DialogState => {
    switch (action.type) {
        case 'launchHidden':
            if (action.payload === undefined || action.payload.pageComponent === undefined) {
                throw new Error('Reducer Error');
            }

            return {
                pageComponent: action.payload.pageComponent,
                ...action.payload,
                type: 'hidden',
            };
        case 'openFullscreen':
            if (action.payload === undefined || action.payload.pageComponent === undefined) {
                throw new Error('Reducer Error');
            }

            return {
                pageComponent: action.payload.pageComponent,
                ...action.payload,
                type: 'fullscreen',
            };
        case 'openInfo':
            if (action.payload === undefined || action.payload.pageComponent === undefined) {
                throw new Error('Reducer Error');
            }

            return {
                pageComponent: action.payload.pageComponent,
                ...action.payload,
                type: 'info',
            };
        case 'openLightbox':
            if (action.payload === undefined || action.payload.pageComponent === undefined) {
                throw new Error('Reducer Error');
            }

            return {
                pageComponent: action.payload.pageComponent,
                ...action.payload,
                type: 'lightbox',
            };
        case 'openDrawer':
            if (action.payload === undefined || action.payload.pageComponent === undefined) {
                throw new Error('Reducer Error');
            }

            return {
                pageComponent: action.payload.pageComponent,
                ...action.payload,
                type: 'drawer',
            };
        case 'setPageHasChanges':
            return {
                ...state,
                pageHasChanges: action.payload?.pageHasChanges,
            };
        case 'openSecondary':
            return {
                ...state,
                secondaryDialogValues: action.payload?.secondaryDialogValues,
                secondaryPageComponent: action.payload?.secondaryPageComponent,
            };
        case 'closeSecondary':
            return {
                ...state,
                secondaryDialogValues: {},
                secondaryPageComponent: undefined,
            };
        case 'close':
            return dialogInit();
        default:
            throw new Error('Reducer Error');
    }
};
