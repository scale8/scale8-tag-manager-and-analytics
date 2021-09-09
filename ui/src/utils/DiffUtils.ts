import {
    DiffFields,
    DiffMap,
    FieldDiff,
    RevisionDiffElement,
    RevisionDiffProp,
    RevisionDiffSide,
} from '../types/DiffTypes';
import { timestampDisplay, UTCTimestamp } from './DateTimeUtils';
import { logError } from './logUtils';

const sideIsArray = (ds: RevisionDiffSide): boolean => {
    if (ds === null) {
        return false;
    }
    return (
        (ds.hasOwnProperty('ea') && ds.ea !== undefined) ||
        (ds.hasOwnProperty('sa') && ds.sa !== undefined) ||
        (ds.hasOwnProperty('ia') && ds.ia !== undefined) ||
        (ds.hasOwnProperty('fa') && ds.fa !== undefined) ||
        (ds.hasOwnProperty('ba') && ds.ba !== undefined) ||
        (ds.hasOwnProperty('da') && ds.da !== undefined)
    );
};

const sideToStringArray = (ds: RevisionDiffSide, noQuote: boolean): string[] => {
    if (ds === null) {
        return [];
    }
    if (ds.hasOwnProperty('s') && ds.s !== undefined) {
        return noQuote ? [`${ds.s}`] : [`"${ds.s}"`];
    }
    if (ds.hasOwnProperty('i') && ds.i !== undefined) {
        return [`${ds.i}`];
    }
    if (ds.hasOwnProperty('f') && ds.f !== undefined) {
        return [`${ds.f}`];
    }
    if (ds.hasOwnProperty('b') && ds.b !== undefined) {
        return [ds.f ? 'TRUE' : 'FALSE'];
    }
    if (ds.hasOwnProperty('d') && ds.d !== undefined) {
        return [timestampDisplay(ds.d as UTCTimestamp)];
    }
    if (ds.hasOwnProperty('sa') && ds.sa !== undefined) {
        return noQuote ? ds.sa.map((_) => `${_}`) : ds.sa.map((_) => `"${_}"`);
    }
    if (ds.hasOwnProperty('ia') && ds.ia !== undefined) {
        return ds.ia.map((_) => `${_}`);
    }
    if (ds.hasOwnProperty('fa') && ds.fa !== undefined) {
        return ds.fa.map((_) => `${_}`);
    }
    if (ds.hasOwnProperty('ba') && ds.ba !== undefined) {
        return ds.ba.map((_) => (_ ? 'TRUE' : 'FALSE'));
    }
    if (ds.hasOwnProperty('da') && ds.da !== undefined) {
        return ds.da.map((_) => timestampDisplay(_ as UTCTimestamp));
    }
    if (ds.hasOwnProperty('ea') && ds.ea !== undefined) {
        return [];
    }
    return [];
};

const propToField = (prop: RevisionDiffProp): FieldDiff => {
    return {
        field: prop.gqlField,
        left: sideToStringArray(prop.left, prop.ref),
        right: sideToStringArray(prop.right, prop.ref),
        leftIsArray: sideIsArray(prop.left),
        rightIsArray: sideIsArray(prop.right),
        isRef: prop.ref,
    };
};

const revisionDiffsToMap = (diffs: RevisionDiffElement[]): DiffMap => {
    const diffMap: DiffMap = new Map();
    diffs.forEach((diff) => {
        diffMap.set(diff.id, {
            fields: diff.props.map((prop) => propToField(prop)),
        });
    });

    return diffMap;
};

const fieldHasChanges = (field: FieldDiff): boolean => {
    if (!field.leftIsArray && !field.rightIsArray) {
        // Both Scalar
        return !(field.left.length === field.right.length && field.left[0] === field.right[0]);
    }
    if (field.leftIsArray && field.rightIsArray) {
        // Both Arrays
        if (
            field.left.length === field.right.length &&
            field.left.every((value, index) => value === field.right[index])
        ) {
            // no changes
            return false;
        }
        // two different arrays
        return true;
    }
    // one is scalar the other array
    return true;
};

const addHasChangesToDiffMap = (fieldsKey: string, diffMap: DiffMap): boolean => {
    const diffFields = diffMap.get(fieldsKey);

    if (diffFields === undefined) {
        logError('Wrong main key specified for diff');
        return false;
    }

    if (diffFields.hasChanges !== undefined) {
        return diffFields.hasChanges;
    }

    let thisHasChanges = false;

    const newFields = diffFields.fields.map((field) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const newField = addHasChangesToField(field, diffMap);
        if (!thisHasChanges) {
            thisHasChanges = !!newField.hasChanges;
        }
        return newField;
    });

    diffMap.set(fieldsKey, {
        fields: newFields,
        hasChanges: thisHasChanges,
    });
    return thisHasChanges;
};

const refArrayHasChanges = (fieldSide: string[], diffMap: Map<string, DiffFields>) => {
    return fieldSide.reduce((hasChanges: boolean, value: string) => {
        const diffMapHadChanges = addHasChangesToDiffMap(value, diffMap);
        return hasChanges ? hasChanges : diffMapHadChanges;
    }, false);
};

const refNotEmptyScalarHasChanges = (fieldSide: string[], diffMap: Map<string, DiffFields>) => {
    if (fieldSide.length > 0) {
        return addHasChangesToDiffMap(fieldSide[0], diffMap);
    }
    return false;
};

const addHasChangesToField = (field: FieldDiff, diffMap: DiffMap): FieldDiff => {
    if (field.isRef) {
        // Add changes to all references
        if (!field.leftIsArray && !field.rightIsArray) {
            // Both Scalars
            if (field.left.length > 0 && field.right.length > 0) {
                if (field.left[0] === field.right[0]) {
                    // same
                    return {
                        ...field,
                        ...{
                            hasChanges: addHasChangesToDiffMap(field.left[0], diffMap),
                        },
                    };
                } else {
                    // different
                    addHasChangesToDiffMap(field.left[0], diffMap);
                    addHasChangesToDiffMap(field.right[0], diffMap);
                    return { ...field, ...{ hasChanges: true } };
                }
            } else if (field.left.length < 1 && field.right.length < 1) {
                // two empty references, no change
                return { ...field, ...{ hasChanges: false } };
            } else {
                // one is empty the other is not
                refNotEmptyScalarHasChanges(field.right, diffMap);
                refNotEmptyScalarHasChanges(field.left, diffMap);
                return { ...field, ...{ hasChanges: true } };
            }
        }
        if (field.leftIsArray && field.rightIsArray) {
            // Both Arrays
            if (field.left.length < 1 && field.right.length < 1) {
                // two empty array, no change
                return { ...field, ...{ hasChanges: false } };
            }
            if (
                field.left.length === field.right.length &&
                field.left.every((value, index) => value === field.right[index])
            ) {
                // Same refs on both
                return {
                    ...field,
                    ...{ hasChanges: refArrayHasChanges(field.left, diffMap) },
                };
            }
            // two different arrays
            refArrayHasChanges(field.left, diffMap);
            refArrayHasChanges(field.right, diffMap);
            return { ...field, ...{ hasChanges: true } };
        }
        // one is scalar the other array
        if (field.leftIsArray) {
            refArrayHasChanges(field.left, diffMap);
            refNotEmptyScalarHasChanges(field.right, diffMap);
        } else {
            refArrayHasChanges(field.right, diffMap);
            refNotEmptyScalarHasChanges(field.left, diffMap);
        }
        return { ...field, ...{ hasChanges: true } };
    } else {
        // Add changes to normal fields
        return { ...field, ...{ hasChanges: fieldHasChanges(field) } };
    }
};

export { fieldHasChanges, revisionDiffsToMap, addHasChangesToDiffMap, addHasChangesToField };
