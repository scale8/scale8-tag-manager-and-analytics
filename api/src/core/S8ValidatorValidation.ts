import { IngestEndpointDataMapValidation, PlatformDataMapValidation } from '../mongo/types/Types';
import { ValidationType } from '../../../common/enums/ValidationType';

export default class S8ValidatorValidation {
    public static testValidationRules(
        rules?: (IngestEndpointDataMapValidation | PlatformDataMapValidation)[],
    ): string[] {
        return (rules || []).flatMap((rule) => {
            if (rule.type === ValidationType.VALID_REGEX) {
                if (typeof rule.input_value === 'string') {
                    try {
                        new RegExp(rule.input_value);
                        return [];
                    } catch (e) {
                        return [`${rule.type}: value provided is not a valid regex`];
                    }
                } else {
                    return [`${rule.type}: a regex needs to be provided`];
                }
            } else if (
                rule.type === ValidationType.VALID_NUMBER_MIN ||
                rule.type === ValidationType.VALID_STRING_MIN_LENGTH
            ) {
                return typeof rule.input_value === 'number'
                    ? []
                    : [`${rule.type}: a minimum number must be provided`];
            } else if (
                rule.type === ValidationType.VALID_NUMBER_MAX ||
                rule.type === ValidationType.VALID_STRING_MAX_LENGTH
            ) {
                return typeof rule.input_value === 'number'
                    ? []
                    : [`${rule.type}: a maximum number must be provided`];
            } else {
                return [`${rule.type} is not supported`];
            }
        });
    }
}
