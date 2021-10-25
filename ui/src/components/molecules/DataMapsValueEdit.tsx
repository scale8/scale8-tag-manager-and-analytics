import { FC, useState } from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { FormElementWithVarType } from '../atoms/InputTypes/FormElementWithVarType';
import { DataMapsPayloadValues } from '../../types/DataMapsTypes';
import { AppPlatformRevision } from '../../types/TagRulesTypes';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { PlatformValueEdit } from '../atoms/PlatformValueEdit';
import { SelectValueWithSub } from '../../hooks/form/useFormValidation';
import { isValueFromPlatform, isVarTypeScalar } from '../../utils/VarTypeUtils';
import { buildDataContainersFilteredPlatforms } from '../../utils/DataContainersUtils';

export type DataContainersElementsFilteredContainer = {
    id: string;
    name: string;
    allowCustom: boolean;
    elements: SelectValueWithSub[];
};

export type DataContainersFilteredPlatform = {
    id: string;
    name: string;
    containers: DataContainersElementsFilteredContainer[];
};

export type DataMapsValueEditProps = {
    dataMapsPayloadValues: DataMapsPayloadValues;
    removeArrayElement: (keyPath: string, index: number) => void;
    addArrayElement: (keyPath: string) => void;
    setValue: (keyPath: string, v: S8DataMapValue, index: number) => void;
    appPlatformRevisions?: AppPlatformRevision[];
    disabled: boolean;
};

const DataMapsValueEdit: FC<DataMapsValueEditProps> = (props: DataMapsValueEditProps) => {
    const { disabled, dataMapsPayloadValues: v, appPlatformRevisions, ...s } = props;

    const [usePlatformValue, setUsePlatformValue] = useState(isValueFromPlatform(v.values[0]));

    const dataContainersFilteredPlatforms: DataContainersFilteredPlatform[] =
        buildDataContainersFilteredPlatforms(appPlatformRevisions, v.dataMap.var_type);

    const canUsePlatformValue: boolean =
        dataContainersFilteredPlatforms.length > 0 && isVarTypeScalar(v.dataMap.var_type);

    return (
        <Box>
            {canUsePlatformValue && (
                <FormControlLabel
                    sx={{
                        fontSize: '11px',
                        '& .MuiFormControlLabel-label': {
                            fontSize: '11px',
                        },
                    }}
                    control={
                        <Checkbox
                            sx={{ fontSize: '14px' }}
                            icon={<CheckBoxOutlineBlankIcon fontSize="inherit" />}
                            checkedIcon={<CheckBoxIcon fontSize="inherit" />}
                            name="usePlatformValue"
                            checked={usePlatformValue}
                            onChange={(event) => {
                                setUsePlatformValue(event.target.checked);
                                s.setValue(v.keyPath, '', 0);
                            }}
                            disabled={disabled}
                            color="primary"
                        />
                    }
                    label="Use Platform Value"
                />
            )}
            {usePlatformValue ? (
                <PlatformValueEdit
                    dataContainersFilteredPlatforms={dataContainersFilteredPlatforms}
                    value={v.values[0].toString()}
                    setValue={(value: string) => s.setValue(v.keyPath, value, 0)}
                    disabled={disabled}
                />
            ) : (
                <FormElementWithVarType
                    {...{
                        arrayContained: false,
                        name: v.dataMap.id,
                        values: v.values,
                        varType: v.dataMap.var_type,
                        setValue: (value, index) => {
                            s.setValue(v.keyPath, value, index);
                        },
                        removeArrayElement: (index) => {
                            s.removeArrayElement(v.keyPath, index);
                        },
                        addArrayElement: () => {
                            s.addArrayElement(v.keyPath);
                        },
                        onBlur: () => {
                            // No validation
                        },
                        disabled,
                    }}
                />
            )}
        </Box>
    );
};

export { DataMapsValueEdit };
