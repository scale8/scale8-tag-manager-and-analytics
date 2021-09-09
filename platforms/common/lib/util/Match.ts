import { ConditionType } from '../../enums/Enums';

export default class Match {
    public static check(
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        leftValue: any,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        rightValue: any,
        matchCondition: ConditionType,
    ): {
        info: string;
        passing: boolean;
    } {
        if (matchCondition === ConditionType.EQUAL) {
            const passing = leftValue === rightValue;
            return {
                info: passing
                    ? `'${leftValue}' is equal to '${rightValue}'`
                    : `'${leftValue}' is not equal to '${rightValue}'`,
                passing: passing,
            };
        } else if (matchCondition === ConditionType.NOT_EQUAL) {
            const passing = leftValue !== rightValue;
            return {
                info: passing
                    ? `'${leftValue}' is not equal to '${rightValue}'`
                    : `'${leftValue}' is equal to '${rightValue}'`,
                passing: passing,
            };
        } else if (matchCondition === ConditionType.IS_NOT_DEFINED) {
            const passing = leftValue === undefined || leftValue === null;
            return {
                info: passing ? `'${leftValue}' is not defined'` : `'${leftValue}' is defined'`,
                passing: passing,
            };
        } else if (matchCondition === ConditionType.IS_DEFINED) {
            const passing = leftValue !== undefined && leftValue !== null;
            return {
                info: passing ? `'${leftValue}' is defined'` : `'${leftValue}' is not defined'`,
                passing: passing,
            };
        } else if (matchCondition === ConditionType.REGULAR_EXPRESSION) {
            const passing = typeof leftValue === 'string' && new RegExp(rightValue).test(leftValue);
            return {
                info: passing
                    ? `'${leftValue}' matches expression '${rightValue}'`
                    : `'${leftValue}' does not match expression '${rightValue}'`,
                passing: passing,
            };
        } else if (matchCondition === ConditionType.BEGINS_WITH) {
            const passing = typeof leftValue === 'string' && leftValue.startsWith(rightValue);
            return {
                info: passing
                    ? `'${leftValue}' begins with '${rightValue}'`
                    : `'${leftValue}' does not begin with ${rightValue}'`,
                passing: passing,
            };
        } else if (matchCondition === ConditionType.ENDS_WITH) {
            const passing = typeof leftValue === 'string' && leftValue.endsWith(rightValue);
            return {
                info: passing
                    ? `'${leftValue}' ends with '${rightValue}'`
                    : `'${leftValue}' does not end with '${rightValue}'`,
                passing: passing,
            };
        } else if (matchCondition === ConditionType.GREATER_THAN) {
            const passing = typeof leftValue === 'number' && leftValue > rightValue;
            return {
                info: passing
                    ? `'${leftValue}' is greater than '${rightValue}'`
                    : `'${leftValue}' is not greater than '${rightValue}'`,
                passing: passing,
            };
        } else if (matchCondition === ConditionType.GREATER_THAN_EQUAL) {
            const passing = typeof leftValue === 'number' && leftValue >= rightValue;
            return {
                info: passing
                    ? `'${leftValue}' is greater than or equal to '${rightValue}'`
                    : `'${leftValue}' is not greater than or equal to '${rightValue}'`,
                passing: passing,
            };
        } else if (matchCondition === ConditionType.LESS_THAN) {
            const passing = typeof leftValue === 'number' && leftValue < rightValue;
            return {
                info: passing
                    ? `'${leftValue}' is less than '${rightValue}'`
                    : `'${leftValue}' is not less than '${rightValue}'`,
                passing: passing,
            };
        } else if (matchCondition === ConditionType.LESS_THAN_EQUAL) {
            const passing = typeof leftValue === 'number' && leftValue <= rightValue;
            return {
                info: passing
                    ? `'${leftValue}' is less than or equal to '${rightValue}'`
                    : `'${leftValue}' is not less than or equal to '${rightValue}'`,
                passing: passing,
            };
        } else if (matchCondition === ConditionType.CONTAINS) {
            if (typeof leftValue === 'string') {
                const passing = leftValue.includes(rightValue);
                return {
                    info: passing
                        ? `'${leftValue}' contains '${rightValue}'`
                        : `'${leftValue}' does not contain '${rightValue}'`,
                    passing: passing,
                };
            } else if (Array.isArray(leftValue)) {
                const passing = (leftValue as any[]).find((v) => v === rightValue) !== undefined;
                return {
                    info: passing
                        ? `Array contains '${rightValue}'`
                        : `Array does not contain '${rightValue}'`,
                    passing: passing,
                };
            } else {
                return {
                    info: 'Condition type "CONTAINS" can only be applied to type "STRING" or "ARRAY"',
                    passing: false,
                };
            }
        } else {
            return {
                info: `${matchCondition} has not been implemented`,
                passing: false,
            };
        }
    }
}
