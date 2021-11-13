import { ChangeEvent, FC, useEffect, useState } from 'react';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import {
    DataManagerDateTimeMacros,
    DataManagerIntegerMacros,
    DataManagerStringMacros,
    DataManagerTimestampMacros,
    VarType,
} from '../../../gql/generated/globalTypes';
import { DataMapDefaultValueFormSection } from '../../molecules/DataMapDefaultValueFormSection';
import { snakeToTitleCase } from '../../../utils/TextUtils';
import { SelectValueWithSub } from '../../../hooks/form/useFormValidation';
import { isVarTypeObject, isVarTypeScalar } from '../../../utils/VarTypeUtils';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import ValidationRulesSection from '../../molecules/ValidationRulesSection';
import { IngestEndpointDataMapFormProps } from '../../../dialogPages/dataManager/IngestEndpointDataMapCreate';

const IngestEndpointDataMapForm: FC<IngestEndpointDataMapFormProps> = (
    props: IngestEndpointDataMapFormProps,
) => {
    const [useMacro, setUseMacro] = useState(false);

    const getRadioValue = () => {
        if (props.values.useDefault) {
            if (useMacro) {
                return 'macro';
            }
            return 'default';
        }
        if (props.values.optional) {
            return 'optional';
        }
        return 'required';
    };

    const getMacroValues = (): string[] => {
        if (props.values.varType === VarType.STRING) {
            return Object.values(DataManagerStringMacros);
        } else if (props.values.varType === VarType.INT) {
            return Object.values(DataManagerIntegerMacros);
        } else if (props.values.varType === VarType.FLOAT) {
            return [];
            // return Object.values(DataManagerFloatMacros);
        } else if (props.values.varType === VarType.BOOLEAN) {
            return [];
            // return Object.values(DataManagerBooleanMacros);
        } else if (props.values.varType === VarType.TIMESTAMP) {
            return Object.values(DataManagerTimestampMacros);
        } else if (props.values.varType === VarType.DATETIME) {
            return Object.values(DataManagerDateTimeMacros);
        } else {
            return [];
        }
    };

    const getMacroSelectValues = (): SelectValueWithSub[] => {
        return getMacroValues().map((_) => ({
            key: _,
            text: _,
        }));
    };

    const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = (event.target as HTMLInputElement).value;
        const useDefault = newValue === 'macro' || newValue === 'default';
        props.setValues({
            ...props.values,
            useDefault,
            optional: newValue === 'optional',
            defaultValue: props.values.varType === VarType.BOOLEAN ? false : '', // boolean select will default to '' otherwise
            defaultValues: [],
        });

        setUseMacro(newValue === 'macro');
    };

    const defaultValue = props.values.defaultValue;

    useEffect(() => {
        setUseMacro(getMacroValues().includes(defaultValue.toString()) ? true : useMacro);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    const varTypeRawValues = Object.keys(VarType)
        .filter((_) => _ !== 'NULL')
        .map((key) => ({
            key,
            text: VarType[key as unknown as keyof typeof VarType],
        }));

    const varTypeValues = varTypeRawValues.map((_) => ({
        key: _.key,
        text: snakeToTitleCase(_.text),
    }));

    const varTypeValuesLastLevel = varTypeRawValues
        .filter((_) => _.key !== VarType.OBJECT && _.key !== VarType.ARRAY_OBJECT)
        .map((_) => ({
            key: _.key,
            text: snakeToTitleCase(_.text),
        }));

    return (
        <DrawerFormLayout {...props} noSubmit={props.readOnly}>
            <ControlledTextInput
                name="key"
                label="Key"
                formProps={props}
                className="DrawerFormField"
                disabled={props.edit || props.readOnly}
                required
            />
            <ControlledSelect
                className="DrawerFormField"
                label="Var Type"
                name="varType"
                values={props.lastLevel ? varTypeValuesLastLevel : varTypeValues}
                formProps={props}
                disabled={props.edit || props.readOnly}
                required
            />
            <RadioGroup
                value={getRadioValue()}
                onChange={handleRadioChange}
                sx={{
                    width: '100%',
                    marginBottom: (theme) => theme.spacing(3),
                }}
            >
                <FormControlLabel
                    value="optional"
                    control={<Radio />}
                    label="Optional"
                    disabled={props.readOnly}
                />
                <FormControlLabel
                    value="required"
                    control={<Radio />}
                    label="Required"
                    disabled={props.readOnly}
                />
                {!isVarTypeObject(props.values.varType as VarType) && (
                    <FormControlLabel
                        value="default"
                        control={<Radio />}
                        label="Use Default Value"
                        disabled={props.readOnly}
                    />
                )}
                {isVarTypeScalar(props.values.varType as VarType) &&
                    getMacroValues().length !== 0 && (
                        <FormControlLabel
                            value="macro"
                            control={<Radio />}
                            label="Use Macro"
                            disabled={props.readOnly}
                        />
                    )}
            </RadioGroup>

            {props.values.varType !== '' &&
                props.values.useDefault &&
                (useMacro ? (
                    <ControlledSelect
                        className="DrawerFormField"
                        label="Macro"
                        name="defaultValue"
                        values={getMacroSelectValues()}
                        formProps={props}
                        disabled={props.readOnly}
                        required
                    />
                ) : (
                    <DataMapDefaultValueFormSection
                        varType={props.values.varType}
                        formProps={props}
                        readOnly={props.readOnly}
                    />
                ))}

            <ValidationRulesSection
                varType={props.values.varType === '' ? null : (props.values.varType as VarType)}
                validationRules={props.values.validationRules}
                handleChange={props.handleChange}
                readOnly={props.readOnly}
            />
        </DrawerFormLayout>
    );
};

export default IngestEndpointDataMapForm;
