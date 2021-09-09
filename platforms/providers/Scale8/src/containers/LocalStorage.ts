import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import {
    PlatformDataContainerChangeData,
    PlatformDataContainerGetData,
} from '../../../../common/types/Types';
import { getTopWindow } from '../../../../common/lib/util/WindowElement';

export const localStorage = {
    persistence_id: 'local-storage',
    icon: TypeIcon.BROWSER_DATA_CONTAINER,
    name: 'Local Storage',
    description: "The browser's local storage",
    allow_custom: true,
    change: (data: PlatformDataContainerChangeData): void => {
        getTopWindow().addEventListener('storage', () => data.trigger(), false);
    },
    get: (data: PlatformDataContainerGetData) => getTopWindow().localStorage.getItem(data.key),
    dump: (): { [k: string]: any } => {
        const ls = getTopWindow().localStorage;
        const store: { [k: string]: any } = {};
        for (let i = 0, l = ls.length; i < l; i++) {
            const k = ls.key(i);
            if (k !== null) {
                store[k] = ls.getItem(k);
            }
        }
        return store;
    },
};
