import AuthenticationError from './AuthenticationError';

export default class PermissionsError extends AuthenticationError {
    constructor(debugMessage: string, userMessage?: string | true, previous?: Error) {
        super(debugMessage, userMessage, previous, 'PermissionsError');
    }
}
