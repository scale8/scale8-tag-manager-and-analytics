import { InputType } from '../../../../../common/enums/InputType';
import { PlatformActionData } from '../../../../common/types/Types';
import Logger from '../../../../common/lib/util/Logger';

export const dataManager = {
    persistence_id: 's8-data-manager',
    name: 'Data Manager',
    description: 'Send to data manager',
    data: [
        {
            key: 'payload',
            input_type: InputType.INGEST_ENDPOINT_PAYLOAD_DESIGNER,
            description: 'Lorum ipsum',
            optional: false,
        },
    ],
    run: (data: PlatformActionData, log: (msg: string) => void): void => {
        Logger.info(data.props);
        //navigator.sendBeacon('');
    },
};
