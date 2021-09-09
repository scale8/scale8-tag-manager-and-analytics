import DataError from './DataError';
import { LogPriority } from '../enums/LogPriority';

export default class GQLError extends DataError {
    constructor(debugMessage: string, userMessage?: string | true, previous?: Error) {
        super(debugMessage, userMessage, previous, LogPriority.DEBUG, 'GQLError');
    }
}
