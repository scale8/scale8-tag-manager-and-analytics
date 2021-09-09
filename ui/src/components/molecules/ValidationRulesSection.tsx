import { FC } from 'react';
import { Box } from '@material-ui/core';
import ValidationRulesInput from '../atoms/ValidationRulesInput';
import { PlatformDataMapValidation } from '../../types/DataMapsTypes';
import { ValidationType, VarType } from '../../gql/generated/globalTypes';

type ValidationRulesSectionProps = {
    varType: VarType | null;
    validationRules: PlatformDataMapValidation[] | undefined;
    readOnly: boolean;
    handleChange: (
        valueKey: string,
        value: any,
        extraValues?: { valueKey: string; value: any }[],
    ) => void;
};

const ValidationRulesSection: FC<ValidationRulesSectionProps> = (
    props: ValidationRulesSectionProps,
) => {
    const { varType, validationRules, handleChange } = props;

    const initialValidationType = (varType: VarType): ValidationType => {
        if (varType === VarType.STRING || varType === VarType.ARRAY_STRING) {
            return ValidationType.VALID_STRING_MAX_LENGTH;
        }
        if (
            varType === VarType.FLOAT ||
            varType === VarType.INT ||
            varType === VarType.ARRAY_FLOAT ||
            varType === VarType.ARRAY_INT
        ) {
            return ValidationType.VALID_NUMBER_MAX;
        }
        return ValidationType.VALID_REGEX;
    };

    const buildValidationTypes = (varType: VarType): { key: string; text: string }[] => {
        if (varType === VarType.STRING || varType === VarType.ARRAY_STRING) {
            return [
                {
                    key: ValidationType.VALID_STRING_MIN_LENGTH as string,
                    text: 'Minimum String length',
                },

                {
                    key: ValidationType.VALID_STRING_MAX_LENGTH as string,
                    text: 'Maximum String length',
                },

                {
                    key: ValidationType.VALID_REGEX as string,
                    text: 'Regular expression',
                },
            ];
        }
        if (
            varType === VarType.FLOAT ||
            varType === VarType.INT ||
            varType === VarType.ARRAY_FLOAT ||
            varType === VarType.ARRAY_INT
        ) {
            return [
                {
                    key: ValidationType.VALID_NUMBER_MIN as string,
                    text: 'Minimum Value',
                },

                {
                    key: ValidationType.VALID_NUMBER_MAX as string,
                    text: 'Maximum Value',
                },
            ];
        }
        return [];
    };

    if (
        varType !== VarType.INT &&
        varType !== VarType.FLOAT &&
        varType !== VarType.STRING &&
        varType !== VarType.ARRAY_STRING &&
        varType !== VarType.ARRAY_INT &&
        varType !== VarType.ARRAY_FLOAT
    ) {
        return null;
    }

    if ((validationRules === undefined || validationRules.length === 0) && props.readOnly) {
        return null;
    }

    return (
        <Box mt={3}>
            <ValidationRulesInput
                types={buildValidationTypes(varType)}
                label="Validation"
                contained={true}
                values={validationRules ?? []}
                setValue={(v, index) => {
                    handleChange(
                        'validationRules',
                        (validationRules ?? []).map((_: PlatformDataMapValidation, key) => {
                            if (key === index) {
                                return v;
                            } else {
                                return _;
                            }
                        }),
                    );
                }}
                removeArrayElement={(index) => {
                    handleChange(
                        'validationRules',
                        (validationRules ?? []).filter((_, key) => key !== index),
                    );
                }}
                addArrayElement={() => {
                    handleChange('validationRules', [
                        ...(validationRules ?? []),
                        {
                            input_value: null,
                            type: initialValidationType(varType),
                        },
                    ]);
                }}
                name="optionValues"
                size="small"
                disabled={props.readOnly}
            />
        </Box>
    );
};

export default ValidationRulesSection;
