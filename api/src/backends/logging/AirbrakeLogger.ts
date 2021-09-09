import { inject, injectable } from 'inversify';
import * as Airbrake from '@airbrake/node';
import GenericError from '../../errors/GenericError';
import BaseLogger from './abstractions/BaseLogger';
import { LogPriority } from '../../enums/LogPriority';
import TYPES from '../../container/IOC.types';
import ConsoleLogger from './ConsoleLogger';
import BaseConfig from '../configuration/abstractions/BaseConfig';
import GQLError from '../../errors/GQLError';

@injectable()
export default class AirbrakeLogger extends BaseLogger {
    @inject(TYPES.ConsoleLogger) private readonly consoleLogger!: ConsoleLogger;
    @inject(TYPES.BackendConfig) private readonly config!: BaseConfig;

    private readonly maxPriority = LogPriority.ERROR;
    private airbrake: Airbrake.Notifier | undefined;

    private async getAirbrake(): Promise<Airbrake.Notifier> {
        if (this.airbrake === undefined) {
            this.airbrake = new Airbrake.Notifier({
                projectId: Number.parseInt(await this.config.getAirbrakeId()),
                projectKey: await this.config.getAirbrakeKey(),
                environment: this.config.getEnvironment(),
            });
        }
        return this.airbrake;
    }

    public async logMessage(
        logPriority: LogPriority,
        message: string,
        contextElements: any[],
    ): Promise<void> {
        await this.consoleLogger.logMessage(logPriority, message, contextElements);
        const airbrake = await this.getAirbrake();

        if (logPriority <= this.maxPriority) {
            await airbrake.notify({
                message,
                context: {
                    extra: contextElements,
                },
            });
        }
    }

    public async logError(err: Error, message?: string): Promise<void> {
        await this.consoleLogger.logError(err, message);
        const airbrake = await this.getAirbrake();
        if (
            (err as GQLError).extensions !== undefined &&
            (err as GenericError).extensions.logPriority !== undefined
        ) {
            if ((err as GenericError).extensions.logPriority <= this.maxPriority) {
                await airbrake.notify({
                    error: err,
                    extra: {
                        message: message,
                        errExtensions: (err as GQLError).extensions,
                    },
                });
            }
        } else {
            await airbrake.notify(err);
        }
    }
}
