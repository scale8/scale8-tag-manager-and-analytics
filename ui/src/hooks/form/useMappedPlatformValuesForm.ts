import { Dispatch, SetStateAction } from 'react';
import { ValuesWithMappedPlatformData } from '../../types/MappedPlatformValuesTypes';
import {
    findNestedPlatformElementAndChange,
    mappedPlatformElementAddChild,
} from '../../utils/MappedPlatformElementUtils';

export type PlatformDataFormResult = {
    handlePlatformDataChange: (
        dataMapId: string,
        value: S8DataMapValue,
        parentLocators: { id: string; index: number }[],
        index?: number,
    ) => void;
    addArrayElement: (dataMapId: string, parentLocators: { id: string; index: number }[]) => void;
    removeArrayElement: (
        dataMapId: string,
        index: number,
        parentLocators: { id: string; index: number }[],
    ) => void;
    addObject: (dataMapId: string, parentLocators: { id: string; index: number }[]) => void;
    removeObject: (
        dataMapId: string,
        index: number,
        parentLocators: { id: string; index: number }[],
    ) => void;
};

const useMappedPlatformValuesForm = <T extends { [key: string]: any }>(
    values: ValuesWithMappedPlatformData<T>,
    setValues: Dispatch<SetStateAction<ValuesWithMappedPlatformData<T>>>,
): PlatformDataFormResult => {
    const handlePlatformDataChange = (
        dataMapId: string,
        value: S8DataMapValue | S8DataMapValue[],
        parentLocators: { id: string; index: number }[],
        index?: number,
    ) => {
        if (values.mappedPlatformValues === undefined) return;
        const platformData = findNestedPlatformElementAndChange(
            values.mappedPlatformValues,
            (mappedPlatformElement) => {
                if (mappedPlatformElement.platformDataMap.id === dataMapId) {
                    if (index === undefined) {
                        return {
                            ...mappedPlatformElement,
                            values: value as S8DataMapValue[],
                        };
                    }
                    if (mappedPlatformElement.errors.has(index)) {
                        mappedPlatformElement.errors.delete(index);
                    }
                    return {
                        ...mappedPlatformElement,
                        values: mappedPlatformElement.values.map((matchValue, key) => {
                            if (key === index) {
                                return value as S8DataMapValue;
                            } else {
                                return matchValue;
                            }
                        }),
                    };
                } else {
                    return mappedPlatformElement;
                }
            },
            parentLocators,
        );
        setValues({
            ...values,
            mappedPlatformValues: platformData,
        });
    };

    const removeElement = (
        dataMapId: string,
        index: number,
        parentLocators: { id: string; index: number }[],
        onObjects: boolean,
    ) => {
        if (values.mappedPlatformValues === undefined) return;

        const platformData = findNestedPlatformElementAndChange(
            values.mappedPlatformValues,
            (mappedPlatformElement) => {
                if (mappedPlatformElement.platformDataMap.id === dataMapId) {
                    if (onObjects) {
                        return {
                            ...mappedPlatformElement,
                            children: mappedPlatformElement.children.filter(
                                (child, key) => key !== index,
                            ),
                        };
                    } else {
                        return {
                            ...mappedPlatformElement,
                            values: mappedPlatformElement.values.filter(
                                (value, key) => key !== index,
                            ),
                        };
                    }
                } else {
                    return mappedPlatformElement;
                }
            },
            parentLocators,
        );

        setValues({
            ...values,
            mappedPlatformValues: platformData,
        });
    };

    const addArrayElement = (
        dataMapId: string,
        parentLocators: { id: string; index: number }[],
    ) => {
        if (values.mappedPlatformValues === undefined) return;

        const platformData = findNestedPlatformElementAndChange(
            values.mappedPlatformValues,
            (mappedPlatformElement) => {
                if (mappedPlatformElement.platformDataMap.id === dataMapId) {
                    return {
                        ...mappedPlatformElement,
                        values: [...mappedPlatformElement.values, ''],
                    };
                } else {
                    return mappedPlatformElement;
                }
            },
            parentLocators,
        );

        setValues({
            ...values,
            mappedPlatformValues: platformData,
        });
    };

    const removeArrayElement = (
        dataMapId: string,
        index: number,
        parentLocators: { id: string; index: number }[],
    ) => {
        removeElement(dataMapId, index, parentLocators, false);
    };

    const addObject = (dataMapId: string, parentLocators: { id: string; index: number }[]) => {
        if (values.mappedPlatformValues === undefined) return;

        const platformData = findNestedPlatformElementAndChange(
            values.mappedPlatformValues,
            (mappedPlatformElement) => {
                if (mappedPlatformElement.platformDataMap.id === dataMapId) {
                    mappedPlatformElementAddChild(mappedPlatformElement);
                }

                return mappedPlatformElement;
            },
            parentLocators,
        );

        setValues({
            ...values,
            mappedPlatformValues: platformData,
        });
    };

    const removeObject = (
        dataMapId: string,
        index: number,
        parentLocators: { id: string; index: number }[],
    ) => {
        removeElement(dataMapId, index, parentLocators, true);
    };

    return {
        handlePlatformDataChange,
        addArrayElement,
        removeArrayElement,
        addObject,
        removeObject,
    };
};

export { useMappedPlatformValuesForm };
