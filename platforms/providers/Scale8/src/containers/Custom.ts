import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import {
    PlatformDataContainerChangeData,
    PlatformDataContainerGetData,
} from '../../../../common/types/Types';
import { find } from '../../../../common/lib/util/ObjectSearch';
import { getTopWindow } from '../../../../common/lib/util/WindowElement';

export const custom = {
    persistence_id: 'custom',
    icon: TypeIcon.ENVIRONMENT_DATA_CONTAINER,
    name: 'Custom Data Layer',
    description: 'A custom defined publisher Data Layer',
    allow_custom: true,
    change: (data: PlatformDataContainerChangeData): void => {
        getTopWindow().addEventListener(
            's8-custom-data-layer-updated',
            () => data.trigger(),
            false,
        );
    },
    get: (data: PlatformDataContainerGetData) =>
        find((getTopWindow() as any).customDataLayer || {}, data.key),
    dump: () => (getTopWindow() as any).customDataLayer || {},
};
