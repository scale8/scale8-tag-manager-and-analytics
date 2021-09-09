import * as util from 'util';
import * as fs from 'fs';
import * as Path from 'path';
import { LogPriority } from '../../enums/LogPriority';
import GenericError from '../../errors/GenericError';
import BaseLogger from './abstractions/BaseLogger';
import { inject, injectable } from 'inversify';
import TYPES from '../../container/IOC.types';
import ConsoleLogger from './ConsoleLogger';
import GQLError from '../../errors/GQLError';

@injectable()
export default class FileLogger extends BaseLogger {
    @inject(TYPES.ConsoleLogger) private readonly consoleLogger!: ConsoleLogger;

    private readonly levels: { [priority: number]: { label: string } } = {
        0: {
            label: 'ERROR',
        },
        1: {
            label: 'WARN',
        },
        2: {
            label: 'INFO',
        },
        3: {
            label: 'DEBUG',
        },
        4: {
            label: 'DATABASE',
        },
        5: {
            label: 'GQL',
        },
    };

    public async logMessage(
        logPriority: LogPriority,
        message: string,
        contextElements: any[],
    ): Promise<void> {
        await this.consoleLogger.logMessage(logPriority, message, contextElements);
        this.logOnFile(logPriority, message, contextElements);
    }

    public async logError(err: Error, message?: string): Promise<void> {
        await this.consoleLogger.logError(err);
        if (
            (err as GQLError).extensions !== undefined &&
            (err as GenericError).extensions.logPriority !== undefined
        ) {
            const errorLogPriority = (err as GenericError).extensions.logPriority;
            this.logOnFile(errorLogPriority, message === undefined ? err.message : message, [
                { error: err },
            ]);
        } else {
            this.logOnFile(
                LogPriority.ERROR,
                message === undefined ? (err as Error).message : message,
                [{ error: err }],
            );
        }
    }

    private logOnFile(logPriority: LogPriority, message: string, context: any[]): void {
        const dateTime = new Date();
        const level = this.levels[logPriority as number];
        const format = `[%s][%s] %s - %j\n`;
        const logDir = Path.resolve(`${process.cwd()}/logs`);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }
        fs.writeFileSync(
            `${logDir}/all.log`,
            util.format(format, level.label, dateTime.toISOString(), message, context),
            { flag: 'a' },
        );
        fs.writeFileSync(
            `${logDir}/${level.label.toLowerCase()}.log`,
            util.format(format, level.label, dateTime.toISOString(), message, context),
            { flag: 'a' },
        );
    }
}
