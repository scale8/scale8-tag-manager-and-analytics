import { injectable } from 'inversify';
import BaseLogger from './abstractions/BaseLogger';
import color, { Colors } from 'colorts';
import { LogPriority } from '../../enums/LogPriority';
import util from 'util';
import GenericError from '../../errors/GenericError';
import GQLError from '../../errors/GQLError';

type LogLevel = {
    priority: number;
    color: (text: string) => Colors;
    label: string;
    consoleFunction: (message?: any, ...optionalParams: any[]) => void;
};

@injectable()
export default class ConsoleLogger extends BaseLogger {
    private readonly maxPriority = LogPriority.INFO;

    private readonly levels: { [priority: number]: LogLevel } = {
        0: {
            priority: 0,
            color: (text: string) => {
                return color(text).bold.red;
            },
            consoleFunction: console.error,
            label: 'ERROR',
        },
        1: {
            priority: 1,
            color: (text: string) => {
                return color(text).yellow;
            },
            consoleFunction: console.log,
            label: 'WARN',
        },
        2: {
            priority: 2,
            color: (text: string) => {
                return color(text).blue;
            },
            consoleFunction: console.log,
            label: 'INFO',
        },
        3: {
            priority: 3,
            color: (text: string) => {
                return color(text).grey;
            },
            consoleFunction: console.log,
            label: 'DEBUG',
        },
        4: {
            priority: 4,
            color: (text: string) => {
                return color(text).cyan;
            },
            consoleFunction: console.log,
            label: 'DATABASE',
        },
        5: {
            priority: 5,
            color: (text: string) => {
                return color(text).magenta;
            },
            consoleFunction: console.log,
            label: 'GQL',
        },
    };

    public async logMessage(
        logPriority: LogPriority,
        message: string,
        contextElements: any[],
    ): Promise<void> {
        const level = this.levels[logPriority as number];
        // Console log only below a certain priority number (lower number higher priority)
        if (level.priority <= this.maxPriority) {
            level.consoleFunction(`[${level.color(level.label)}] ${message}`);
            if (contextElements.length > 0) {
                level.consoleFunction(util.inspect(contextElements, false, null, true));
            }
        }
    }

    public async logError(err: Error, message?: string): Promise<void> {
        if (
            (err as GQLError).extensions !== undefined &&
            (err as GenericError).extensions.logPriority !== undefined
        ) {
            const errorLogPriority = (err as GenericError).extensions.logPriority;
            const level = this.levels[errorLogPriority as number];
            if (message !== undefined) {
                level.consoleFunction(`[${level.color(level.label)}]`, message, err);
            } else {
                level.consoleFunction(`[${level.color(level.label)}]`, err);
            }
            if (
                (err as GQLError).extensions.exception !== undefined &&
                (err as GQLError).extensions.exception.stacktrace !== undefined
            ) {
                console.error(
                    util.inspect(
                        (err as GQLError).extensions.exception.stacktrace,
                        false,
                        null,
                        true,
                    ),
                );
            }
        } else {
            if (message !== undefined) {
                console.error(`[Native Error]`, message, err);
            } else {
                console.error(`[Native Error]`, err);
            }

            if (err.stack !== undefined) {
                console.error(util.inspect(err.stack, false, null, true));
            }
        }
    }
}
