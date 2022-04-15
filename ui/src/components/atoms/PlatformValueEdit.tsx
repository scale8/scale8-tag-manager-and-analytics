import { FC, useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { FormErrors, SelectValueWithSub } from '../../hooks/form/useFormValidation';
import { snakeToTitleCase, splitTwice } from '../../utils/TextUtils';
import ControlledFilteredSelects from './ControlledInputs/ControlledFilteredSelects';
import { DataContainer } from '../../types/DataMapsTypes';
import ControlledTextInput from './ControlledInputs/ControlledTextInput';
import ControlledSelect from './ControlledInputs/ControlledSelect';
import { platformDataMapsToSelectValues } from '../../utils/DataContainersUtils';
import { VarType } from '../../gql/generated/globalTypes';

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
        <Box>
            {noContainers ? (
                <small>There are no platforms with data containers available.</small>
            ) : (
                <ControlledFilteredSelects
                    className="DrawerFormField"
                    label="Data Container"
                    initialFilterValue={findPlatformIdFromContainerId(
                        initialDataContainerId,
                        dataContainersSelectValues,
                    )}
                    name="dataContainerId"
                    values={dataContainersSelectValues}
                    formProps={formProps}
                    required
                    disabled={disabled}
                    filterLabel="Platform"
                    missingSubMessage="There are no data containers available in this platform."
                    hideNoSub
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
                <ControlledTextInput
                    name="dataElement"
                    label="Custom Data Element"
                    formProps={formProps}
                    className="DrawerFormField"
                    required
                />
            )}

            {currentDataContainer && hasDataMaps && !useCustom && (
                <>
                    <ControlledSelect
                        className="DrawerFormField"
                        label="Data Element"
                        name="dataElement"
                        values={platformDataMapsToSelectValues(
                            currentDataContainer.platform_data_maps,
                            true,
                        )}
                        formProps={formProps}
                        required
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
            {isDataElementObject && (
                <ControlledTextInput
                    name="objectKey"
                    label="Key"
                    formProps={formProps}
                    className="DrawerFormField"
                    required
                />
            )}
        </Box>
    );
};

export { PlatformValueEdit };
