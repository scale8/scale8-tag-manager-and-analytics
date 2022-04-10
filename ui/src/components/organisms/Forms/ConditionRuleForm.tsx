import { FC, useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { ConditionType, InputType, VarType } from '../../../gql/generated/globalTypes';
import { ConditionRuleFormProps } from '../../../hooks/form/useConditionRuleForm';
import ControlledFilteredSelects from '../../atoms/ControlledInputs/ControlledFilteredSelects';
import { FormElementWithInputType } from '../../atoms/InputTypes/FormElementWithInputType';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { matchConditionValues } from '../../../utils/MatchConditionValues';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';
import { extractDataMapDefaultValue } from '../../../utils/MappedPlatformElementUtils';
import { buildConditionName } from '../../../dialogPages/tagManager/app/trigger/ConditionRuleUpdate';
import { snakeToTitleCase } from '../../../utils/TextUtils';
import { platformDataMapsToSelectValues } from '../../../utils/DataContainersUtils';

const ConditionRuleForm: FC<ConditionRuleFormProps> = (props: ConditionRuleFormProps) => {
    const [useCustom, setUseCustom] = useState(false);
    const [generateName, setGenerateName] = useState(
        props.generateName === undefined ? true : props.generateName,
    );

    const { values, currentDataContainer, handleChange, dataContainers } = props;

    useEffect(() => {
        if (
            currentDataContainer &&
            currentDataContainer.allow_custom &&
            currentDataContainer.platform_data_maps.length < 1
        ) {
            setUseCustom(true);
        } else {
            setUseCustom(false);
        }
    }, [currentDataContainer]);

    const noContainers = props.dataContainers.length < 1;

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

    const ready = !notAvailable && !noContainers && props.currentDataContainer;

    useEffect(() => {
        const currentName = buildConditionName(values, dataContainers, currentDataContainer);

        if (ready && generateName && values.name !== currentName) {
            handleChange('name', currentName);
        }
    }, [ready, values, currentDataContainer, handleChange, generateName, dataContainers]);

    const isRawObject =
        props.currentDataElement !== undefined &&
        props.currentDataElement.var_type === VarType.OBJECT &&
        props.currentDataElement.child_platform_data_maps.length === 0;

    const findConditionInputType = (): InputType | 'Custom' => {
        if (props.currentDataElement === undefined || isRawObject) {
            return 'Custom';
        }

        return props.currentDataElement.input_type;
    };

    const conditionInputType = findConditionInputType();

    const filteredConditions = matchConditionValues.filter((matchConditionValue) =>
        matchConditionValue.types.includes(conditionInputType),
    );

    const noConditions = filteredConditions.length === 0;

    return (
        <DrawerFormLayout {...props} submitDisable={props.isSubmitting || !ready || noConditions}>
            {noContainers ? (
                <small>There are no platforms with data containers available.</small>
            ) : (
                <ControlledFilteredSelects
                    disabled={!!props.update}
                    className="DrawerFormField"
                    label="Data Container"
                    initialFilterValue={props.initialPlatformId}
                    name="dataContainerId"
                    values={dataContainers}
                    formProps={props}
                    required
                    filterLabel="Platform"
                    missingSubMessage="There are no data containers available in this platform."
                    hideNoSub
                />
            )}
            {currentDataContainer && (
                <Box
                    component="small"
                    sx={{
                        width: '100%',
                        margin: (theme) => theme.spacing(0, 0, 2),
                    }}
                >
                    {currentDataContainer.description}
                </Box>
            )}

            {notAvailable && (
                <small>It is not possible to use this data container in a condition.</small>
            )}

            {hasDataMapsAndCustom && (
                <FormControlLabel
                    control={
                        <Checkbox
                            name="useCustom"
                            checked={useCustom}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    // force values reset by pretend to change data container
                                    handleChange('dataContainerId', props.values.dataContainerId);
                                    setUseCustom(true);
                                } else {
                                    // force values reset by pretend to change data container
                                    handleChange('dataContainerId', props.values.dataContainerId);
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
                    name="match"
                    label="Custom Data Element"
                    formProps={props}
                    className="DrawerFormField"
                    required
                />
            )}

            {currentDataContainer && hasDataMaps && !useCustom && (
                <ControlledSelect
                    className="DrawerFormField"
                    label="Data Element"
                    name="matchId"
                    values={platformDataMapsToSelectValues(currentDataContainer.platform_data_maps)}
                    formProps={props}
                    required
                />
            )}
            {noConditions ? (
                <Box
                    component="small"
                    sx={{
                        width: '100%',
                        margin: (theme) => theme.spacing(0, 0, 2),
                    }}
                >
                    It is not possible to use this data element in a condition.
                </Box>
            ) : (
                (props.currentDataElement !== undefined || useCustom) && (
                    <>
                        {props.currentDataElement && (
                            <Box
                                component="small"
                                sx={{
                                    width: '100%',
                                    margin: (theme) => theme.spacing(0, 0, 2),
                                }}
                            >
                                ({snakeToTitleCase(props.currentDataElement.var_type)}){' '}
                                {props.currentDataElement.description}
                            </Box>
                        )}
                        {isRawObject && (
                            <ControlledTextInput
                                name="matchKey"
                                label="Key"
                                formProps={props}
                                className="DrawerFormField"
                                required
                            />
                        )}
                        <ControlledSelect
                            className="DrawerFormField"
                            label="Condition"
                            name="matchCondition"
                            values={filteredConditions.map((matchConditionValue) => ({
                                key: matchConditionValue.condition,
                                text: `${matchConditionValue.symbol} (${matchConditionValue.text})`,
                            }))}
                            formProps={props}
                            required
                        />
                        {props.values.matchCondition !== ConditionType.IS_DEFINED &&
                            props.values.matchCondition !== ConditionType.IS_NOT_DEFINED && (
                                <FormElementWithInputType
                                    {...{
                                        label: 'Value',
                                        name: 'dataMapValue',
                                        values: [props.values.dataMapValue],
                                        inputType: isRawObject
                                            ? InputType.TEXT
                                            : props.currentDataElement?.input_type ??
                                              InputType.TEXT,
                                        optionValues: props.currentDataElement?.option_values ?? [],
                                        setValue: (v) => {
                                            props.handleChange('dataMapValue', v);
                                        },
                                        removeArrayElement: () => {
                                            // Flatten
                                        },
                                        addArrayElement: () => {
                                            // Flatten
                                        },
                                        consentPurposes: props.consentPurposes,
                                        consentVendors: props.consentVendors,
                                        defaultValue:
                                            props.currentDataElement !== undefined &&
                                            props.currentDataElement !== null
                                                ? extractDataMapDefaultValue(
                                                      props.currentDataElement,
                                                  )
                                                : null,
                                        onBlur: props.handleBlur,
                                        errors: props.errors.dataMapValue
                                            ? new Map([[0, props.errors.dataMapValue]])
                                            : new Map(),
                                        disabled: false,
                                        required: true,
                                        flatten: true,
                                        className: 'DrawerFormField',
                                    }}
                                />
                            )}
                    </>
                )
            )}
            {ready && !noConditions && (
                <>
                    <FormControlLabel
                        sx={{ marginBottom: (theme) => theme.spacing(3) }}
                        control={
                            <Checkbox
                                name="generateName"
                                checked={generateName}
                                onChange={(event) => {
                                    setGenerateName(event.target.checked);
                                }}
                                color="primary"
                            />
                        }
                        label="Generate Name"
                    />
                    {!generateName && (
                        <ControlledTextInput
                            name="name"
                            label="Name"
                            formProps={props}
                            className="DrawerFormField"
                            required
                        />
                    )}
                </>
            )}
            <ControlledTextAreaInput
                name="comments"
                label="Comments"
                formProps={props}
                className="DrawerFormField"
            />
        </DrawerFormLayout>
    );
};

export default ConditionRuleForm;
