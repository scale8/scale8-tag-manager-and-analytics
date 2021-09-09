import { injectable } from 'inversify';
import { LogPriority } from '../../../enums/LogPriority';

@injectable()
export default abstract class BaseLogger {
    public abstract logError(err: Error, message?: string): Promise<void>;

    public abstract logMessage(
        logPriority: LogPriority,
        message: string,
        contextElements: any[],
    ): Promise<void>;

    public warn(message: string, ...contextElements: any[]): Promise<void> {
        return this.logMessage(LogPriority.WARN, message, contextElements);
    }

    public info(message: string, ...contextElements: any[]): Promise<void> {
        return this.logMessage(LogPriority.INFO, message, contextElements);
    }

    public debug(message: string, ...contextElements: any[]): Promise<void> {
        return this.logMessage(LogPriority.DEBUG, message, contextElements);
    }

    public database(message: string, ...contextElements: any[]): Promise<void> {
        return this.logMessage(LogPriority.DATABASE, message, contextElements);
    }

    public gql(message: string, ...contextElements: any[]): Promise<void> {
        return this.logMessage(LogPriority.GQL, message, contextElements);
    }
}
