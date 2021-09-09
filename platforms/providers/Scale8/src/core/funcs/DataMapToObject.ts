import { DataMap, RepeatedDataMap } from '../config/ModelTypes';
import Collection from '../config/Collection';

export const dataMapToObject = (dataMaps: DataMap[]): { [k: string]: any } => {
    const getObjectValue = (dataMap: DataMap) => {
        if (dataMap._child_data_map_ids.length > 0) {
            return dataMapToObject(
                Collection.findByIds<DataMap>('DataMap', dataMap._child_data_map_ids),
            );
        } else if (dataMap._repeated_data_map_ids.length > 0) {
            return dataMap._repeated_data_map_ids.map((_) => {
                const repeatedDataMap = Collection.findByIdThrows<RepeatedDataMap>(
                    'RepeatedDataMap',
                    _,
                );
                return dataMapToObject(
                    Collection.findByIds<DataMap>(
                        'DataMap',
                        repeatedDataMap._repeated_child_data_map_ids,
                    ),
                );
            });
        } else {
            return dataMap._value;
        }
    };
    return dataMaps
        .map((dataMap) => [dataMap._key, getObjectValue(dataMap)])
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
};
