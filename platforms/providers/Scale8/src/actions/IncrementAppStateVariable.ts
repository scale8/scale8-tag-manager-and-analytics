import { InputType } from '../../../../../common/enums/InputType';
import { ValidationType } from '../../../../../common/enums/ValidationType';
import { PlatformActionData } from '../../../../common/types/Types';
import AppState from '../core/lib/AppState';

export const incrementAppStateVariable = {
    persistence_id: 's8-action-increment-app-state-var',
    name: 'Set App-State Variable',
    description:
        'This action will create a custom hidden image tag used to trigger a tracking pixel.',
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
            key: 'value',
            input_type: InputType.TEXT,
            description:
                'Only string values are currently supported, although more support for other variable types will be added soon.',
            optional: false,
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
        log(`Increment ${data.props.key}`);
        const val = AppState.get(data.props.key);
        AppState.set(
            data.props.key,
            typeof val === 'number' ? val + 1 : 1,
            data.props.page_only === 'Yes',
        );
    },
};
