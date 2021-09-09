import GenericError from './GenericError';
import { LogPriority } from '../enums/LogPriority';

export default class DataError extends GenericError {
    constructor(
        debugMessage: string,
        userMessage?: string | true,
        previous?: Error,
        logPriority?: LogPriority,
        codeOverride?: string,
    ) {
        super(
            debugMessage,
            logPriority === undefined ? LogPriority.DEBUG : logPriority,
            userMessage,
            previous,
            codeOverride !== undefined ? codeOverride : 'DataError',
        );
    }
}
