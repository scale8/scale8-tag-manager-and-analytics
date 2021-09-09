import Logger from '../../../../../common/lib/util/Logger';
import Collection from '../config/Collection';
import { PlatformEventCreateData, PlatformEventTestData } from '../../../../../common/types/Types';

export type CreateFunction = (
    data: PlatformEventCreateData,
    log: (msg: string) => void,
    err: (msg: string) => void,
) => void;

export type TestFunction = (
    data: PlatformEventTestData,
    log: (msg: string) => void,
    err: (msg: string) => void,
) => boolean;

export type ResetFunction = (
    data: PlatformEventCreateData,
    log: (msg: string) => void,
    err: (msg: string) => void,
) => void;

export type PlatformEventFunctions = {
    create: CreateFunction;
    test: TestFunction;
    reset?: ResetFunction;
};

export default class PlatformEventRegister {
    public static readonly platformEvents: Map<string, Map<string, PlatformEventFunctions>> =
        new Map();

    public static registerEvent(
        platformId: string,
        persistingId: string,
        create: CreateFunction,
        test: TestFunction,
        reset?: ResetFunction,
    ): void {
        const platformEvent = Collection.findOne('PlatformEvent', {
            _platform_id: platformId,
            ___persisting_id: persistingId,
        });
        if (platformEvent === undefined) {
            Logger.info(
                `Unable to find PlatformEvent and register ${persistingId} on platform ${platformId}. This suggests the event is not in use`,
            );
        } else {
            const events =
                this.platformEvents.get(platformId) || new Map<string, PlatformEventFunctions>();
            events.set(persistingId, {
                create: create,
                reset: reset,
                test: test,
            });
            this.platformEvents.set(platformId, events);
        }
    }

    public static isEventRegistered(platformId: string, persistingId: string): boolean {
        const platformEvents = this.platformEvents.get(platformId);
        return platformEvents === undefined
            ? false
            : platformEvents.get(persistingId) !== undefined;
    }

    public static getEventFunctions(
        platformId: string,
        persistingId: string,
    ): PlatformEventFunctions {
        const platformEvents = this.platformEvents.get(platformId);
        if (platformEvents === undefined) {
            throw new Error('Failed to find platform...');
        } else {
            const event = platformEvents.get(persistingId);
            if (event === undefined) {
                throw new Error('Failed to find platform event functions...');
            } else {
                return event;
            }
        }
    }
}
