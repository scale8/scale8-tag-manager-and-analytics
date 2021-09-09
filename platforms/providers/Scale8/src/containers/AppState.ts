import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import AppState from '../core/lib/AppState';
import {
    PlatformDataContainerChangeData,
    PlatformDataContainerGetData,
} from '../../../../common/types/Types';

export const appState = {
    persistence_id: 'app-state',
    icon: TypeIcon.ENVIRONMENT_DATA_CONTAINER,
    name: 'App State',
    description:
        'A simple data object used for tracking state changes. Actions can update this object with new data and conditions/exceptions can test variables data.',
    allow_custom: true,
    change: (data: PlatformDataContainerChangeData) => AppState.addUpdateHook(() => data.trigger()),
    get: (data: PlatformDataContainerGetData) => AppState.get(data.key),
    dump: () => AppState.dump(),
};
