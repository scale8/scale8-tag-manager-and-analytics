import Logger from '../../../../../common/lib/util/Logger';
import Collection from '../config/Collection';
import {
    PlatformDataContainerChangeData,
    PlatformDataContainerDumpData,
    PlatformDataContainerGetData,
} from '../../../../../common/types/Types';

type GetFunction = (
    data: PlatformDataContainerGetData,
    log: (msg: string) => void,
    err: (msg: string) => void,
) => any;

type ChangeFunction = (
    data: PlatformDataContainerChangeData,
    log: (msg: string) => void,
    err: (msg: string) => void,
) => void;

type DumpFunction = (
    data: PlatformDataContainerDumpData,
) => { [k: string]: any } | [string, { [k: string]: any }][];

type PlatformDataContainerFunctions = {
    dump: DumpFunction;
    get: GetFunction;
    change?: ChangeFunction;
};

export default class PlatformDataContainerRegister {
    public static readonly platformDataContainers: Map<
        string,
        Map<string, PlatformDataContainerFunctions>
    > = new Map();

    public static registerDataContainer(
        platformId: string,
        persistingId: string,
        dump: DumpFunction,
        get: GetFunction,
        change?: ChangeFunction,
    ): void {
        const platformDataContainer = Collection.findOne('PlatformDataContainer', {
            _platform_id: platformId,
            ___persisting_id: persistingId,
        });
        if (platformDataContainer === undefined) {
            Logger.info(
                `Unable to find PlatformDataContainer and register ${persistingId} against platform ${platformId}. This suggests the data container is not in use`,
            );
        } else {
            const dataLayers =
                this.platformDataContainers.get(platformId) ||
                new Map<string, PlatformDataContainerFunctions>();
            dataLayers.set(persistingId, {
                dump: dump,
                get: get,
                change: change,
            });
            this.platformDataContainers.set(platformId, dataLayers);
        }
    }

    public static isDataContainerRegistered(platformId: string, persistingId: string): boolean {
        const platformDataContainers = this.platformDataContainers.get(platformId);
        return platformDataContainers === undefined
            ? false
            : platformDataContainers.get(persistingId) !== undefined;
    }

    public static getPlatformDataContainers(): Map<
        string,
        Map<string, PlatformDataContainerFunctions>
    > {
        return this.platformDataContainers;
    }

    public static getDataContainerFunctions(
        platformId: string,
        persistingId: string,
    ): PlatformDataContainerFunctions {
        const platformDataContainers = this.platformDataContainers.get(platformId);
        if (platformDataContainers === undefined) {
            throw new Error('Failed to find platform...');
        } else {
            const container = platformDataContainers.get(persistingId);
            if (container === undefined) {
                throw new Error('Failed to find platform data container...');
            } else {
                return container;
            }
        }
    }
}
