import GenericError from './GenericError';
import { LogPriority } from '../enums/LogPriority';

export default class DatabaseError extends GenericError {
    constructor(debugMessage: string, userMessage?: string | true, previous?: Error) {
        super(debugMessage, LogPriority.ERROR, userMessage, previous, 'DatabaseError');
    }
}
