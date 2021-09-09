import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { find } from '../../../../common/lib/util/ObjectSearch';
import Context from '../core/lib/Context';
import { PlatformDataContainerGetData } from '../../../../common/types/Types';

export const environment = {
    persistence_id: 'environment',
    icon: TypeIcon.ENVIRONMENT_DATA_CONTAINER,
    name: 'Environment Variables',
    description:
        'These variables are public and defined when you are creating an environment. Environment variables can be updated or changed at any time via the UI',
    allow_custom: true,
    get: (data: PlatformDataContainerGetData) => find(Context.getEnvironmentVars(), data.key),
    dump: () => Context.getEnvironmentVars(),
};
