import { SelectValueWithSub } from '../hooks/form/useFormValidation';

const selectCompare = (a: SelectValueWithSub, b: SelectValueWithSub): 1 | -1 => {
    const buildCompareValue = (i: SelectValueWithSub) => `${i.iconType ?? ''}${i.text}`;

    return buildCompareValue(a) > buildCompareValue(b) ? 1 : -1;
};

export { selectCompare };
