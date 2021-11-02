/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection JSUnusedLocalSymbols

import { PlatformSpec } from '../../../../common/interfaces/PlatformSpec';
import { InputType } from '../../../../common/enums/InputType';
import registerPlatformSpec from '../../../common/RegisterPlatform';

const spec: PlatformSpec = {
    name: 'Demo Platform', // name of your platform
    version: {
        major: 0,
        minor: 0,
        patch: 1,
    },
    settings: [
        {
            key: 'platform_key',
            input_type: InputType.TEXT,
            description: 'A key available to every platform action and event.',
        },
    ],
    actions: [
        {
            persistence_id: 'demo-action', // a unique id for the action
            name: 'Demo Action', // name of your action
            description: 'A simple hello world action example', // a quick description of what the action does
            data: [
                // a set of data inputs for the action. these will be configured in the UI by the user
                {
                    key: 'hello',
                    input_type: InputType.TEXT,
                    description: 'Text to say hello to',
                    default_value: 'World',
                },
            ],
            run: async (
                // the action logic. 'data' is made available to act on user inputs and also other properties
                data,
                log: (msg: string) => void,
                err: (msg: string) => void,
            ): Promise<any> => {
                const message = `Hello ${data.props.hello}`;
                log(message);
                console.log(message);
            },
        },
    ],
};

//finally we register the platform
registerPlatformSpec(spec);
