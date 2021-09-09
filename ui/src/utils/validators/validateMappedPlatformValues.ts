import { MappedPlatformElement, MappedPlatformValues } from '../../types/MappedPlatformValuesTypes';
import { InputType, ValidationType, VarType } from '../../gql/generated/globalTypes';

const validateMappedPlatformValues = (
    platformData: MappedPlatformValues,
    ignoreEmpty: boolean,
): { mappedPlatformValues: MappedPlatformValues; hasErrors: boolean } => {
    // Validation for query elements
    const isSelectorValid = (selector: string) => {
        try {
            document.querySelector(selector);
        } catch {
            return false;
        }
        return true;
    };

    const mappedPlatformValues = platformData.map(
        (mappedPlatformElement: MappedPlatformElement) => {
            const valueIsOptional: boolean = mappedPlatformElement.platformDataMap.is_optional;

            // Code (check for required)
            if (
                mappedPlatformElement.platformDataMap.input_type === InputType.JAVASCRIPT ||
                mappedPlatformElement.platformDataMap.input_type === InputType.CSS ||
                mappedPlatformElement.platformDataMap.input_type === InputType.HTML ||
                mappedPlatformElement.platformDataMap.input_type === InputType.JSON ||
                mappedPlatformElement.platformDataMap.input_type ===
                    InputType.INGEST_ENDPOINT_PAYLOAD_DESIGNER
            ) {
                if (ignoreEmpty) {
                    // Don' trigger the error
                } else if (
                    !valueIsOptional &&
                    (mappedPlatformElement.values.length === 0 ||
                        mappedPlatformElement.values[0] === '')
                ) {
                    mappedPlatformElement.errors.set(0, 'Required value');
                }
            }

            // Numbers
            if (
                mappedPlatformElement.platformDataMap.input_type === InputType.INT_INPUT ||
                mappedPlatformElement.platformDataMap.input_type === InputType.INT_ARRAY_INPUT ||
                mappedPlatformElement.platformDataMap.input_type === InputType.FLOAT_INPUT ||
                mappedPlatformElement.platformDataMap.input_type === InputType.FLOAT_ARRAY_INPUT
            ) {
                mappedPlatformElement.values.forEach((value, index) => {
                    if ((ignoreEmpty || valueIsOptional) && +value === 0) {
                        // Don' trigger the error
                    } else if (isNaN(+value)) {
                        mappedPlatformElement.errors.set(index, 'Value must be a number');
                    }
                });
            }

            // URL
            if (
                mappedPlatformElement.platformDataMap.input_type === InputType.URL ||
                mappedPlatformElement.platformDataMap.input_type ===
                    InputType.URL_WITH_MACRO_SUPPORT
            ) {
                mappedPlatformElement.values.forEach((value, index) => {
                    const testValue = value.toString();
                    if ((ignoreEmpty || valueIsOptional) && testValue === '') {
                        // Don' trigger the error
                    } else if (testValue.match(/^.+\..+$/) === null) {
                        mappedPlatformElement.errors.set(index, 'Invalid URL');
                    }
                });
            }

            // Email
            if (mappedPlatformElement.platformDataMap.input_type === InputType.EMAIL) {
                mappedPlatformElement.values.forEach((value, index) => {
                    if ((ignoreEmpty || valueIsOptional) && value === '') {
                        // Don' trigger the error
                    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value.toString())) {
                        mappedPlatformElement.errors.set(index, 'Invalid email address');
                    }
                });
            }

            // Dom Selector
            if (mappedPlatformElement.platformDataMap.input_type === InputType.DOM_SELECTOR_INPUT) {
                mappedPlatformElement.values.forEach((value, index) => {
                    if ((ignoreEmpty || valueIsOptional) && value === '') {
                        // Don' trigger the error
                    } else if (!isSelectorValid(value.toString())) {
                        mappedPlatformElement.errors.set(index, 'Invalid DOM selector');
                    }
                });
            }

            // Bespoke Validation
            if (
                mappedPlatformElement.platformDataMap.validation_rules !== null &&
                mappedPlatformElement.platformDataMap.validation_rules !== undefined
            ) {
                mappedPlatformElement.platformDataMap.validation_rules.forEach((validationRule) => {
                    // String Min
                    if (
                        mappedPlatformElement.platformDataMap.var_type === VarType.STRING &&
                        validationRule.input_value !== null &&
                        validationRule.type === ValidationType.VALID_STRING_MIN_LENGTH
                    ) {
                        const min: number = validationRule.input_value as number;
                        mappedPlatformElement.values.forEach((value, index) => {
                            if ((ignoreEmpty || valueIsOptional) && value === '') {
                                // Don' trigger the error
                            } else if (value.toString().length < min) {
                                mappedPlatformElement.errors.set(index, `Minimum length: ${min}`);
                            }
                        });
                    }

                    // String Max
                    if (
                        mappedPlatformElement.platformDataMap.var_type === VarType.STRING &&
                        validationRule.input_value !== null &&
                        validationRule.type === ValidationType.VALID_STRING_MAX_LENGTH
                    ) {
                        const max: number = validationRule.input_value as number;
                        mappedPlatformElement.values.forEach((value, index) => {
                            if ((ignoreEmpty || valueIsOptional) && value === '') {
                                // Don' trigger the error
                            } else if (value.toString().length > max) {
                                mappedPlatformElement.errors.set(index, `Maximum length: ${max}`);
                            }
                        });
                    }

                    // String Regex
                    if (
                        mappedPlatformElement.platformDataMap.var_type === VarType.STRING &&
                        validationRule.input_value !== null &&
                        validationRule.type === ValidationType.VALID_REGEX
                    ) {
                        const regex: string = validationRule.input_value as string;

                        mappedPlatformElement.values.forEach((value, index) => {
                            if ((ignoreEmpty || valueIsOptional) && value === '') {
                                // Don' trigger the error
                            } else if (!new RegExp(regex).test(value.toString())) {
                                mappedPlatformElement.errors.set(index, `Invalid value`);
                            }
                        });
                    }

                    // Number Min
                    if (
                        (mappedPlatformElement.platformDataMap.var_type === VarType.INT ||
                            mappedPlatformElement.platformDataMap.var_type === VarType.FLOAT) &&
                        validationRule.input_value !== null &&
                        validationRule.type === ValidationType.VALID_NUMBER_MIN
                    ) {
                        const min: number = validationRule.input_value as number;
                        mappedPlatformElement.values.forEach((value, index) => {
                            if ((ignoreEmpty || valueIsOptional) && value === '') {
                                // Don' trigger the error
                            } else if (value < min) {
                                mappedPlatformElement.errors.set(index, `Minimum value: ${min}`);
                            }
                        });
                    }

                    // Number Max
                    if (
                        (mappedPlatformElement.platformDataMap.var_type === VarType.INT ||
                            mappedPlatformElement.platformDataMap.var_type === VarType.FLOAT) &&
                        validationRule.input_value !== null &&
                        validationRule.type === ValidationType.VALID_NUMBER_MAX
                    ) {
                        const max: number = validationRule.input_value as number;
                        mappedPlatformElement.values.forEach((value, index) => {
                            if ((ignoreEmpty || valueIsOptional) && value === '') {
                                // Don' trigger the error
                            } else if (value > max) {
                                mappedPlatformElement.errors.set(index, `Maximum value: ${max}`);
                            }
                        });
                    }
                });
            }

            const childrenValidate = mappedPlatformElement.children.map((child) =>
                validateMappedPlatformValues(child, ignoreEmpty),
            );

            mappedPlatformElement.children = childrenValidate.map((_) => _.mappedPlatformValues);

            mappedPlatformElement.childrenHaveError = childrenValidate.some((_) => _.hasErrors);

            return mappedPlatformElement;
        },
    );

    return {
        mappedPlatformValues,
        hasErrors: mappedPlatformValues.some((_) => _.errors.size > 0 || _.childrenHaveError),
    };
};

export { validateMappedPlatformValues };
