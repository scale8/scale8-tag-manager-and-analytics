import GenericError from './GenericError';
import { LogPriority } from '../enums/LogPriority';

export default class AuthenticationError extends GenericError {
    constructor(
        debugMessage: string,
        userMessage?: string | true,
        previous?: Error,
        codeOverride?: string,
    ) {
        super(
            debugMessage,
            LogPriority.DEBUG,
            userMessage,
            previous,
            codeOverride !== undefined ? codeOverride : 'AuthenticationError',
        );
    }
}
