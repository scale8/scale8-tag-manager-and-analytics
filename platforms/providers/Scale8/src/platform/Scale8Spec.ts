import { PlatformSpec } from '../../../../../common/interfaces/PlatformSpec';

import { trackEvent } from '../actions/TrackEvent';
import { actionLog } from '../actions/ActionLog';
import { setAppStateVariable } from '../actions/SetAppStateVariable';
import { incrementAppStateVariable } from '../actions/IncrementAppStateVariable';
import { injectScript } from '../actions/InjectScript';
import { createHiddenFrame } from '../actions/CreateHiddenFrame';
import { firePixel } from '../actions/FirePixel';
import { loadJs } from '../actions/LoadJs';
import { loadHTML } from '../actions/LoadHTML';
import { cmpCheck } from '../events/CMPCheck';
import { formSubmit } from '../events/FormSubmit';
import { elementAttributeMatch } from '../events/ElementAttributeMatch';
import { tagClick } from '../events/TagClick';
import { clickElements } from '../events/ClickElements';
import { tagInView } from '../events/TagInView';
import { elementInView } from '../events/ElementInView';
import { tagTimer } from '../events/TagTimer';
import { pageReady } from '../events/PageReady';
import { pageLoaded } from '../events/PageLoaded';
import { pageInFocus } from '../events/PageInFocus';
import { pageBlur } from '../events/PageBlur';
import { historyChange } from '../events/HistoryChange';
import { jsError } from '../events/JsError';
import { environment } from '../containers/Environment';
import { appState } from '../containers/AppState';
import { custom } from '../containers/Custom';
import { localStorage } from '../containers/LocalStorage';
import { queryString } from '../containers/QueryString';
import { browser } from '../containers/Browser';
import { elementClick } from '../containers/ElementClick';
import { browserError } from '../containers/BrowserError';
import { dataManager } from '../actions/DataManager';

const scale8Spec: PlatformSpec = {
    name: 'Scale8 Core',
    version: {
        major: 0,
        minor: 0,
        patch: 2,
    },
    actions: [
        trackEvent,
        actionLog,
        setAppStateVariable,
        incrementAppStateVariable,
        injectScript,
        createHiddenFrame,
        firePixel,
        loadJs,
        loadHTML,
        dataManager,
    ],
    events: [
        cmpCheck,
        formSubmit,
        elementAttributeMatch,
        tagClick,
        clickElements,
        tagInView,
        elementInView,
        tagTimer,
        pageReady,
        pageLoaded,
        pageInFocus,
        pageBlur,
        historyChange,
        jsError,
    ],
    data_containers: [
        environment,
        appState,
        custom,
        localStorage,
        queryString,
        browser,
        elementClick,
        browserError,
    ],
};

export default scale8Spec;
