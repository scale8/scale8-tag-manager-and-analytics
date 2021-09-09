import { InputType } from '../../../../../common/enums/InputType';
import { ValidationType } from '../../../../../common/enums/ValidationType';
import { PlatformActionData } from '../../../../common/types/Types';
import AppState from '../core/lib/AppState';

export const setAppStateVariable = {
    persistence_id: 's8-action-set-app-state-var',
    name: 'Increment App-State Variable',
    description:
        "This action will increment the value of the key provided. If the value doesn't exist it will be set to 1, otherwise it will be incremented",
    data: [
        {
            key: 'key',
            input_type: InputType.TEXT,
            description: "Dot notation supported key. e.g. 'a.b.c'",
            optional: false,
            validation_rules: [
                {
                    type: ValidationType.VALID_REGEX,
                    input_value: '^[a-z]+(?:[\\.]{1}[a-z]+){0,}$',
                },
            ],
        },
        {
            key: 'page_only',
            input_type: InputType.RADIO,
            option_values: ['Yes', 'No'],
            default_value: 'Yes',
            description:
                "If page only is set to 'Yes' then anything set will only persist while user remains on the page. Otherwise if 'No' it will persist via local storage and can be referenced on subsequent page loads. For single page applications, if the navigation changes this will wipe any page state data.",
            optional: false,
        },
    ],
    run: (data: PlatformActionData, log: (msg: string) => void): void => {
        log(`Set ${data.props.key} = ${JSON.stringify(data.props.value)}`);
        AppState.set(data.props.key, data.props.value, data.props.page_only === 'Yes');
    },
};
