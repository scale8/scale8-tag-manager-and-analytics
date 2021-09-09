import { PlatformDataMapInput } from '../../../types/DataMapsTypes';

const deleteTemplatedActionDataMap = (
    indexes: number[],
    platformDataMaps: PlatformDataMapInput[],
    handleChange: (valueKey: string, value: any) => void,
): void => {
    const setPlatformDatamaps = (v: PlatformDataMapInput[]) => {
        handleChange('platformDataMaps', v);
    };
    if (indexes.length === 1) {
        setPlatformDatamaps(platformDataMaps.filter((_, i) => i !== indexes[0]));
    } else if (indexes.length === 2) {
        setPlatformDatamaps(
            platformDataMaps.map((d, i) => {
                if (i === indexes[0]) {
                    return {
                        ...d,
                        child_platform_data_maps: d.child_platform_data_maps.filter(
                            (_, ii) => ii !== indexes[1],
                        ),
                    };
                } else {
                    return d;
                }
            }),
        );
    } else if (indexes.length === 3) {
        setPlatformDatamaps(
            platformDataMaps.map((d, i) => {
                if (i === indexes[0]) {
                    return {
                        ...d,
                        child_platform_data_maps: d.child_platform_data_maps.map((dd, ii) => {
                            if (ii === indexes[1]) {
                                return {
                                    ...dd,
                                    child_platform_data_maps: dd.child_platform_data_maps.filter(
                                        (_, iii) => iii !== indexes[2],
                                    ),
                                };
                            } else {
                                return dd;
                            }
                        }),
                    };
                } else {
                    return d;
                }
            }),
        );
    }
};

export { deleteTemplatedActionDataMap };
