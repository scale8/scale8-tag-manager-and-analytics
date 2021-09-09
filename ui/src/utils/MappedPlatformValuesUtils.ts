import { DataMapInput } from '../gql/generated/globalTypes';
import { MappedPlatformValues } from '../types/MappedPlatformValuesTypes';
import {
    mappedPlatformElementFromDataMapWithValues,
    mappedPlatformElementToDataMapInput,
} from './MappedPlatformElementUtils';
import { DataMap, PlatformDataMap } from '../types/DataMapsTypes';

const mappedPlatformValuesToDataMapInput = (
    mappedPlatformValues: MappedPlatformValues,
): DataMapInput[] => {
    return mappedPlatformValues
        .map((_) => mappedPlatformElementToDataMapInput(_))
        .filter((_) => _ !== undefined) as DataMapInput[];
};

const mappedPlatformValuesFromDataMapsWithValues = (
    platformDataMaps: PlatformDataMap[],
    dataMaps: DataMap[],
): MappedPlatformValues =>
    platformDataMaps.map((_) =>
        mappedPlatformElementFromDataMapWithValues(
            _,
            dataMaps.find((dm) => dm.key === _.key) as DataMap,
        ),
    );

export { mappedPlatformValuesToDataMapInput, mappedPlatformValuesFromDataMapsWithValues };
