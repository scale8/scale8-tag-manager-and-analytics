import userMessages from './UserMessages';
import { LogPriority } from '../enums/LogPriority';
import container from '../container/IOC.config';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import TYPES from '../container/IOC.types';
import { ApolloError } from 'apollo-server-express';

export default class GenericError extends ApolloError {
    constructor(
        debugMessage: string,
        logPriority: LogPriority,
        userMessage?: string | true,
        previous?: Error,
        codeOverride?: string,
    ) {
        const config = container.get<BaseConfig>(TYPES.BackendConfig);

        const getUserMessage: () => string = () => {
            if (userMessage === true) {
                return debugMessage;
            } else if (typeof userMessage === 'string') {
                return userMessage;
            }
            return userMessages.genericError;
        };
        const userMessageWithDefault = getUserMessage();
        const message = config.isDevelopment() ? debugMessage : userMessageWithDefault;
        super(message, codeOverride !== undefined ? codeOverride : 'GenericError', {
            logPriority,
            userMessage: userMessageWithDefault,
            debugMessage,
            previous,
        });
    }

    public getUserMessage(): string {
        return this.extensions.userMessage ?? '';
    }

    public getDebugMessage(): string {
        return this.extensions.debugMessage ?? '';
    }
}
