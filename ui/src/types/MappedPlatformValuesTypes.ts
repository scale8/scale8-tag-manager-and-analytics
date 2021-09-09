import { PlatformDataMap } from './DataMapsTypes';

export type ValuesWithMappedPlatformData<T extends { [key: string]: any }> = T & {
    mappedPlatformValues?: MappedPlatformValues;
};

export type MappedPlatformValues = MappedPlatformElement[];

export type MappedPlatformElement = {
    platformDataMap: PlatformDataMap;
    values: S8DataMapValue[];
    errors: Map<number, string>;
    children: MappedPlatformValues[];
    childrenHaveError?: boolean;
};
