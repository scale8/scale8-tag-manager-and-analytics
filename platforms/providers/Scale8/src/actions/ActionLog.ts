import { InputType } from '../../../../../common/enums/InputType';
import { PlatformActionData } from '../../../../common/types/Types';
import Logger from '../../../../common/lib/util/Logger';

export const actionLog = {
    persistence_id: 's8-action-log',
    name: 'Simple Logger',
    description: 'This action will log a message to the debug console',
    data: [
        {
            key: 'message',
            input_type: InputType.TEXT_WITH_MACRO_SUPPORT,
            description: 'The message that will appear in the debug console',
            optional: false,
        },
    ],
    run: (data: PlatformActionData, log: (msg: string) => void): void => {
        const replacement = data.macroReplace(data.props.message);
        log(replacement);
        Logger.info(replacement);
    },
};
