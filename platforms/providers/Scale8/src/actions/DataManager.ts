import { InputType } from '../../../../../common/enums/InputType';
import { PlatformActionData } from '../../../../common/types/Types';

export const dataManager = {
    persistence_id: 's8-data-manager',
    name: 'Data Manager',
    description: 'Construct the data payload to be sent to the specified Data Manager endpoint.',
    data: [
        {
            key: 'payload',
            input_type: InputType.INGEST_ENDPOINT_PAYLOAD_DESIGNER,
            description: 'Use the above input to help define the payload to be sent.',
            optional: false,
        },
    ],
    run: (
        data: PlatformActionData,
        log: (msg: string) => void,
        err: (msg: string) => void,
    ): void => {
        const config = JSON.parse(data.props.payload);
        const payload: { [k: string]: string } = config.payload;
        if (typeof payload === 'object') {
            const macroReplacedPayload = Object.keys(payload).reduce((previousValue, key) => {
                const value = data.macroReplace(payload[key]);
                if (value !== undefined) {
                    previousValue[key] = value;
                } else {
                    log(`Skipping payload value for ${key} as it is undefined`);
                }
                return previousValue;
            }, {} as { [k: string]: string });
            navigator.sendBeacon(
                `${config.endpoint}`,
                new Blob([JSON.stringify(macroReplacedPayload)], {
                    type: 'application/json',
                }),
            );
        } else {
            err('No payload has been defined');
        }
    },
};
