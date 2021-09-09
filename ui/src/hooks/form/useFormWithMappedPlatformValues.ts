import { useCallback, useEffect, useState } from 'react';
import { PlatformDataFormResult, useMappedPlatformValuesForm } from './useMappedPlatformValuesForm';
import { FormValidationResult, FormValues, useFormValidation } from './useFormValidation';
import { ValuesWithMappedPlatformData } from '../../types/MappedPlatformValuesTypes';
import { DataContainer, DataMap, PlatformDataMap } from '../../types/DataMapsTypes';
import { ValidateConfiguration } from '../../utils/validators/validateFormValues';
import { mappedPlatformValuesFromDataMapsWithValues } from '../../utils/MappedPlatformValuesUtils';
import { mappedPlatformElementFromDataMap } from '../../utils/MappedPlatformElementUtils';

export type ModelWithPlatformDataMaps = {
    id: string;
    dataContainer?: DataContainer;
    platformDataMaps: PlatformDataMap[];
};

export type FormWithMappedPlatformValuesResult<T extends FormValues> = PlatformDataFormResult &
    FormValidationResult<T> & {
        currentModelWithPlatformDataMaps?: ModelWithPlatformDataMaps;
    };

const useFormWithMappedPlatformValues = <T extends FormValues>(
    initialState: ValuesWithMappedPlatformData<T>,
    validators: ValidateConfiguration<T>[],
    submit: (values: ValuesWithMappedPlatformData<T>) => Promise<void>,
    availableModelsWithPlatformDataMaps: ModelWithPlatformDataMaps[],
    idValueForModelWithPlatformDataMaps: string,
    existingModelData?: { id: string; dataMaps: DataMap[] },
): FormWithMappedPlatformValuesResult<T> => {
    const [currentModelWithPlatformDataMaps, setCurrentModelWithPlatformDataMaps] = useState<
        ModelWithPlatformDataMaps | undefined
    >(undefined);

    const setCurrentModelWithPlatformDataMapsCallback = useCallback(
        setCurrentModelWithPlatformDataMaps,
        [],
    );

    const { handleSubmit, handleChange, handleBlur, errors, values, setValues, isSubmitting } =
        useFormValidation<ValuesWithMappedPlatformData<T>>(initialState, validators, submit, true);

    const setValuesCallback = useCallback(setValues, []);

    useEffect(() => {
        if (values[idValueForModelWithPlatformDataMaps] !== undefined) {
            const newModelWithPlatformDataMaps = availableModelsWithPlatformDataMaps.find(
                (modelWithPlatformDataMap) =>
                    modelWithPlatformDataMap.id === values[idValueForModelWithPlatformDataMaps],
            );
            if (
                newModelWithPlatformDataMaps !== undefined &&
                currentModelWithPlatformDataMaps?.id !== newModelWithPlatformDataMaps.id
            ) {
                // Init Specific Platform Values
                setValuesCallback({
                    ...values,
                    mappedPlatformValues:
                        existingModelData &&
                        existingModelData.id === newModelWithPlatformDataMaps.id
                            ? mappedPlatformValuesFromDataMapsWithValues(
                                  newModelWithPlatformDataMaps.platformDataMaps,
                                  existingModelData.dataMaps,
                              )
                            : newModelWithPlatformDataMaps.platformDataMaps.map((platformDataMap) =>
                                  mappedPlatformElementFromDataMap(platformDataMap),
                              ),
                });
                setCurrentModelWithPlatformDataMapsCallback(newModelWithPlatformDataMaps);
            }
        }
    }, [
        values,
        idValueForModelWithPlatformDataMaps,
        availableModelsWithPlatformDataMaps,
        currentModelWithPlatformDataMaps,
        setCurrentModelWithPlatformDataMapsCallback,
        setValuesCallback,
        existingModelData,
    ]);

    const {
        handlePlatformDataChange,
        addArrayElement,
        removeArrayElement,
        addObject,
        removeObject,
    } = useMappedPlatformValuesForm<T>(values, setValues);

    return {
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        setValues,
        errors,
        isSubmitting,
        handlePlatformDataChange,
        addArrayElement,
        removeArrayElement,
        addObject,
        removeObject,
        currentModelWithPlatformDataMaps,
    };
};

export { useFormWithMappedPlatformValues };
