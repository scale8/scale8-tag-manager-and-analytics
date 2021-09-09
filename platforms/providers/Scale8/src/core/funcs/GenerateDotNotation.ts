import { PlatformDataContainer, PlatformDataMap } from '../config/ModelTypes';
import Collection from '../config/Collection';
import { RefId } from '../../../../../common/models/RefId';

export const generateDotNotation = (
    platformDataContainerId: RefId,
    platformDataMapId: RefId,
): string => {
    const locatePlatformDataMap = (
        platformDataMaps: PlatformDataMap[],
        target: PlatformDataMap,
        previousKey: string | null = null,
    ): string | undefined => {
        const found = platformDataMaps.find((_) => _._id.id === target._id.id);
        if (found === undefined) {
            //not found, so check the child data maps...
            for (let i = 0; i < platformDataMaps.length; i++) {
                const parent = platformDataMaps[i];
                const located = locatePlatformDataMap(
                    Collection.findByIds<PlatformDataMap>(
                        'PlatformDataMap',
                        parent._child_platform_data_map_ids,
                    ),
                    target,
                    previousKey === null ? parent._key : `${previousKey}.${parent._key}`,
                );
                if (typeof located === 'string') {
                    return located;
                }
            }
        } else {
            return previousKey === null ? found._key : `${previousKey}.${found._key}`;
        }
        return undefined;
    };

    const target = Collection.findByIdThrows<PlatformDataMap>('PlatformDataMap', platformDataMapId);

    const key = locatePlatformDataMap(
        Collection.findByIds<PlatformDataMap>(
            'PlatformDataMap',
            Collection.findByIdThrows<PlatformDataContainer>(
                'PlatformDataContainer',
                platformDataContainerId,
            )._platform_data_map_ids,
        ),
        target,
    );

    if (key === undefined) {
        throw new Error(`Unable to generate dot notation key for data map ${target._key}`);
    } else {
        return key;
    }
};
