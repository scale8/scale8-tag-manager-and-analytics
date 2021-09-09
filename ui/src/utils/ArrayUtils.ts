import { Order } from '../components/molecules/S8Table/S8TableTypes';

const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
    if (Array.isArray(a[orderBy]) && Array.isArray(b[orderBy])) {
        // if array of numbers (graph) compare last value
        const arrayA: number[] = a[orderBy] as unknown as number[];
        const arrayB: number[] = b[orderBy] as unknown as number[];
        if (arrayB[arrayB.length - 1] < arrayA[arrayA.length - 1]) {
            return -1;
        }
        if (arrayB[arrayB.length - 1] > arrayA[arrayA.length - 1]) {
            return 1;
        }
        return 0;
    } else {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }
};

const getComparator = <Key extends keyof any>(
    order: Order,
    orderBy: Key,
): ((
    a: { [key in Key]: number | string | number[] },
    b: { [key in Key]: number | string | number[] },
) => number) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = <T>(array: T[], comparator: (a: T, b: T) => number): T[] => {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
};

const moveDownId = (idArray: string[], id: string): string[] => {
    const index = idArray.findIndex((s) => s === id);
    if (index < 0 || index === idArray.length - 1) {
        return idArray;
    }
    return idArray.map((currentId, currentIndex, originalArray) => {
        if (currentIndex === index) return originalArray[index + 1];
        if (currentIndex === index + 1) return originalArray[index];
        return currentId;
    });
};

const moveUpId = (idArray: string[], id: string): string[] => {
    const index = idArray.findIndex((s) => s === id);
    if (index < 1) {
        return idArray;
    }
    return idArray.map((currentId, currentIndex, originalArray) => {
        if (currentIndex === index - 1) return originalArray[index];
        if (currentIndex === index) return originalArray[index - 1];
        return currentId;
    });
};

const modelsDeleteReducer = (
    accumulator: Map<string, { name: string; id: string }[]>,
    currentValue: { name: string; id: string; model: any },
): Map<string, { name: string; id: string }[]> => {
    const currentArray = Array.isArray(accumulator.get(currentValue.model))
        ? accumulator.get(currentValue.model)
        : [];
    return accumulator.set(currentValue.model, [
        ...(currentArray ?? []),
        { name: currentValue.name, id: currentValue.id },
    ]);
};

const modelsLinkReducer = (
    accumulator: Map<string, { name: string; id: string }[]>,
    currentValue: { name: string; id: string; entity: any },
): Map<string, { name: string; id: string }[]> => {
    const currentArray = Array.isArray(accumulator.get(currentValue.entity))
        ? accumulator.get(currentValue.entity)
        : [];
    return accumulator.set(currentValue.entity, [
        ...(currentArray ?? []),
        { name: currentValue.name, id: currentValue.id },
    ]);
};

export { getComparator, stableSort, moveDownId, moveUpId, modelsDeleteReducer, modelsLinkReducer };
