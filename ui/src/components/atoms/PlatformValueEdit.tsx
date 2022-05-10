import { FC, useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { FormErrors, SelectValueWithSub } from '../../hooks/form/useFormValidation';
import { snakeToTitleCase, splitTwice } from '../../utils/TextUtils';
import { DataContainer } from '../../types/DataMapsTypes';
import { platformDataMapsToSelectValues } from '../../utils/DataContainersUtils';
import { VarType } from '../../gql/generated/globalTypes';
import { DialogFormTextInput } from './DialogFormInputs/DialogFormTextInput';
import { DialogFormSelect } from './DialogFormInputs/DialogFormSelect';
import { DialogFormFilteredSelects } from './DialogFormInputs/DialogFormFilteredSelects';
import { DialogFormContextProvider } from '../../context/DialogFormContext';

export type PlatformValueEditProps = {
    value: string;
    setValue: (value: string) => void;
    availableDataContainers: DataContainer[];
    dataContainersSelectValues: SelectValueWithSub[];
    disabled: boolean;
};

const findPlatformIdFromContainerId = (
    containerId: string,
    platforms: SelectValueWithSub[],
): string => {
    if (containerId === '') return '';

    const platform: SelectValueWithSub | undefined = platforms.find((platform) => {
        if (platform.sub === undefined) return false;
        return platform.sub.find((container) => container.key === containerId) !== undefined;
    });

    if (platform === undefined) return '';

    return platform.key;
};

type PlatformValues = { dataContainerId: string; objectKey: string; dataElement: string };

const PlatformValueEdit: FC<PlatformValueEditProps> = (props: PlatformValueEditProps) => {
    const { value, setValue, dataContainersSelectValues, disabled, availableDataContainers } =
        props;

    const match = value.match(/^{{([^}]+)}}$/);
    const path = match === null ? '' : match[1];

    const [initialDataContainerPersistingId, initialDataElement, initialObjectKey] = splitTwice(
        path,
        '.',
    );

    const initialDataContainer = availableDataContainers.find(
        (dataContainer) => dataContainer.persisting_id === initialDataContainerPersistingId,
    );

    const initialDataContainerId = initialDataContainer?.id ?? '';

    const [useCustom, setUseCustom] = useState(false);

    const [values, setValues] = useState({
        dataContainerId: initialDataContainerId,
        dataElement: initialDataElement ?? '',
        objectKey: initialObjectKey ?? '',
    });

    const currentDataContainer = availableDataContainers.find(
        (dataContainer) => dataContainer.id === values.dataContainerId,
    );

    useEffect(() => {
        if (values.dataElement !== '' && currentDataContainer) {
            setValue(
                `{{${currentDataContainer.persisting_id}.${values.dataElement}${
                    values.objectKey === '' ? '' : '.'
                }${values.objectKey}}}`,
            );
        } else {
            setValue('');
        }
    }, [values]);

    const noContainers = availableDataContainers.length < 1;

    const notAvailable =
        currentDataContainer !== undefined &&
        !currentDataContainer.allow_custom &&
        currentDataContainer.platform_data_maps.length === 0;

    const hasDataMaps =
        currentDataContainer !== undefined && currentDataContainer.platform_data_maps.length > 0;

    const hasDataMapsAndCustom =
        currentDataContainer !== undefined &&
        currentDataContainer.platform_data_maps.length > 0 &&
        currentDataContainer.allow_custom;

    const formProps = {
        handleChange: (valueKey: string, value: any) => {
            if (valueKey === 'dataContainerId') {
                setValues({
                    dataContainerId: value,
                    dataElement: '',
                    objectKey: '',
                });
            } else if (valueKey === 'dataElement') {
                setValues({
                    ...values,
                    dataElement: value,
                    objectKey: '',
                });
            } else {
                setValues({
                    ...values,
                    [valueKey]: value,
                });
            }
        },
        handleBlur: () => {
            //no validation
        },
        errors: {} as FormErrors<any>,
        values,
        setValues,
    };

    useEffect(() => {
        if (
            currentDataContainer &&
            currentDataContainer.allow_custom &&
            currentDataContainer.platform_data_maps.length < 1
        ) {
            if (values.objectKey) {
                setValues({
                    ...values,
                    dataElement: `${values.dataElement}.${values.objectKey}`,
                    objectKey: '',
                });
            }

            setUseCustom(true);
        } else {
            setUseCustom(false);
        }
    }, [currentDataContainer]);

    const currentDataElement = (currentDataContainer?.platform_data_maps ?? []).find(
        (_) => _.key === values.dataElement,
    );

    const isDataElementObject =
        currentDataElement !== undefined && currentDataElement.var_type === VarType.OBJECT;

    return (
        <DialogFormContextProvider<PlatformValues> formProps={formProps}>
            <Box>
                {noContainers ? (
                    <small>There are no platforms with data containers available.</small>
                ) : (
                    <DialogFormFilteredSelects
                        name="dataContainerId"
                        label="Data Container"
                        initialFilterValue={findPlatformIdFromContainerId(
                            initialDataContainerId,
                            dataContainersSelectValues,
                        )}
                        values={dataContainersSelectValues}
                        filterLabel="Platform"
                        missingSubMessage="There are no data containers available in this platform."
                        disabled={disabled}
                    />
                )}
                {currentDataContainer && (
                    <Box
                        component="small"
                        sx={{
                            display: 'block',
                            width: '100%',
                            margin: (theme) => theme.spacing(0, 0, 2),
                        }}
                    >
                        {currentDataContainer.description}
                    </Box>
                )}

                {notAvailable && (
                    <small>It is not possible to use this data container for this field.</small>
                )}

                {hasDataMapsAndCustom && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="useCustom"
                                checked={useCustom}
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        setUseCustom(true);
                                    } else {
                                        setUseCustom(false);
                                    }
                                }}
                                color="primary"
                            />
                        }
                        label="Use Custom Data Element"
                    />
                )}

                {useCustom && (
                    <DialogFormTextInput name="dataElement" label="Custom Data Element" />
                )}

                {currentDataContainer && hasDataMaps && !useCustom && (
                    <>
                        <DialogFormSelect
                            label="Data Element"
                            name="dataElement"
                            values={platformDataMapsToSelectValues(
                                currentDataContainer.platform_data_maps,
                                true,
                            )}
                        />
                    </>
                )}
                {currentDataElement && (
                    <Box
                        component="small"
                        sx={{
                            display: 'block',
                            width: '100%',
                            margin: (theme) => theme.spacing(0, 0, 2),
                        }}
                    >
                        ({snakeToTitleCase(currentDataElement.var_type)}){' '}
                        {currentDataElement.description}
                    </Box>
                )}
                {isDataElementObject && <DialogFormTextInput name="objectKey" label="Key" />}
            </Box>
        </DialogFormContextProvider>
    );
};

export { PlatformValueEdit };
