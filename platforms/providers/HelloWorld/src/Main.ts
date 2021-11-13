import { PlatformSpec } from '../../../../common/interfaces/PlatformSpec';
import { InputType } from '../../../../common/enums/InputType';
import registerPlatformSpec from '../../../common/RegisterPlatform';

// noinspection JSUnusedLocalSymbols
const spec: PlatformSpec = {
    name: 'Hello World', // name of your platform
    version: {
        major: 0,
        minor: 0,
        patch: 1,
    },
    actions: [
        {
            persistence_id: 'hello-world', // a unique id for the action
            name: 'Hello World', // name of your action
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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
