import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { InputType } from '../../../../../common/enums/InputType';
import ErrorData from '../core/lib/ErrorData';
import {
    PlatformDataContainerChangeData,
    PlatformDataContainerGetData,
} from '../../../../common/types/Types';

export const browserError = {
    persistence_id: 'error',
    icon: TypeIcon.BROWSER_DATA_CONTAINER,
    name: 'Last Error',
    description: 'The data of the last error caught in the browser',
    allow_custom: false,
    data: [
        {
            key: 'file',
            input_type: InputType.TEXT,
            description: 'The file name that the error was triggered from',
        },
        {
            key: 'message',
            input_type: InputType.TEXT,
            description: 'The error message',
        },
        {
            key: 'line',
            input_type: InputType.INT_INPUT,
            description: 'The line number at which the error was triggered',
        },
        {
            key: 'column',
            input_type: InputType.INT_INPUT,
            description: 'The column number at which the error was triggered',
        },
    ],
    change: (data: PlatformDataContainerChangeData) =>
        ErrorData.addUpdateHook(() => data.trigger()),
    get: (data: PlatformDataContainerGetData) => ErrorData.get(data.key),
    dump: () => ErrorData.dump(),
};
