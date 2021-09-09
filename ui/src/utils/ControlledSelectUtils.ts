import { SelectValueWithSub } from '../hooks/form/useFormValidation';

export type controlledSelectValuesFindResult = {
    key: string;
    text: string;
    description: string;
    parent?: { key: string; text: string };
};

const controlledSelectValuesFindByInnerKey = (
    controlledSelectValues: SelectValueWithSub[],
    key: string,
): controlledSelectValuesFindResult | undefined => {
    const flattenSelectValuesFindResults = controlledSelectValues.reduce((accumulator, current) => {
        const newElements: controlledSelectValuesFindResult[] = [];
        if (current.sub) {
            current.sub.forEach((_) =>
                newElements.push({
                    ..._,
                    parent: { key: current.key, text: current.text },
                } as controlledSelectValuesFindResult),
            );
        } else {
            newElements.push(current as controlledSelectValuesFindResult);
        }
        return [...accumulator, ...newElements];
    }, [] as controlledSelectValuesFindResult[]);

    return flattenSelectValuesFindResults.find((_) => _.key === key);
};

export { controlledSelectValuesFindByInnerKey };
