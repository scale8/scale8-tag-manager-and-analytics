import S8ValidatorValidation from '../../../src/core/S8ValidatorValidation';
import { ValidationType } from '../../../../common/enums/ValidationType';

describe('S8ValidatorValidation', () => {
    const validRegex = "([^']*)";
    const invalidRegex = '[[[[';

    test.each`
        type                                      | input_value     | expected
        ${'invalid type'}                         | ${2}            | ${['invalid type is not supported']}
        ${ValidationType.VALID_REGEX}             | ${validRegex}   | ${[]}
        ${ValidationType.VALID_REGEX}             | ${invalidRegex} | ${['VALID_REGEX: value provided is not a valid regex']}
        ${ValidationType.VALID_REGEX}             | ${2}            | ${['VALID_REGEX: a regex needs to be provided']}
        ${ValidationType.VALID_NUMBER_MIN}        | ${2}            | ${[]}
        ${ValidationType.VALID_STRING_MIN_LENGTH} | ${2}            | ${[]}
        ${ValidationType.VALID_NUMBER_MAX}        | ${2}            | ${[]}
        ${ValidationType.VALID_STRING_MAX_LENGTH} | ${2}            | ${[]}
        ${ValidationType.VALID_NUMBER_MIN}        | ${''}           | ${['VALID_NUMBER_MIN: a minimum number must be provided']}
        ${ValidationType.VALID_STRING_MIN_LENGTH} | ${''}           | ${['VALID_STRING_MIN_LENGTH: a minimum number must be provided']}
        ${ValidationType.VALID_NUMBER_MAX}        | ${''}           | ${['VALID_NUMBER_MAX: a maximum number must be provided']}
        ${ValidationType.VALID_STRING_MAX_LENGTH} | ${''}           | ${['VALID_STRING_MAX_LENGTH: a maximum number must be provided']}
        ${ValidationType.VALID_NUMBER_MIN}        | ${[]}           | ${['VALID_NUMBER_MIN: a minimum number must be provided']}
        ${ValidationType.VALID_STRING_MIN_LENGTH} | ${[]}           | ${['VALID_STRING_MIN_LENGTH: a minimum number must be provided']}
        ${ValidationType.VALID_NUMBER_MAX}        | ${[]}           | ${['VALID_NUMBER_MAX: a maximum number must be provided']}
        ${ValidationType.VALID_STRING_MAX_LENGTH} | ${[]}           | ${['VALID_STRING_MAX_LENGTH: a maximum number must be provided']}
    `(
        'returns $expected when $input_value is provided for validation type $type',
        ({ type, input_value, expected }) => {
            expect(
                S8ValidatorValidation.testValidationRules([{ type, input_value }]),
            ).toStrictEqual(expected);
        },
    );
});
