import { FC } from 'react';
import { DiffMap, FieldDiff } from '../../../types/DiffTypes';
import { getDiffMapChangedFields, ListFields } from './ListFields';
import ObjectDiffContainer from './ObjectDiffContainer';
import DiffSpacer from './DiffSpacer';
import NoChanges from './NoChanges';

type ObjectDiffProps = {
    objKey: string;
    diffMap: DiffMap;
    fieldDiff: FieldDiff;
};

const establishMode = (
    fieldDiff: FieldDiff,
    objKey: string,
    diffMapChangedFields: FieldDiff[],
): 'unchanged' | 'added' | 'removed' => {
    if (
        fieldDiff.left.find((value) => value === objKey) &&
        !fieldDiff.right.find((value) => value === objKey)
    ) {
        return 'removed';
    } else if (
        fieldDiff.right.find((value) => value === objKey) &&
        !fieldDiff.left.find((value) => value === objKey)
    ) {
        return 'added';
    } else if (diffMapChangedFields.length > 0) {
        return 'added';
    } else {
        return 'unchanged';
    }
};

const ObjectDiff: FC<ObjectDiffProps> = (props: ObjectDiffProps) => {
    const { objKey, diffMap, fieldDiff } = props;

    const diffMapChangedFields = getDiffMapChangedFields(objKey, diffMap);
    return (
        <>
            <ObjectDiffContainer
                diffMap={diffMap}
                objKey={objKey}
                mode={establishMode(fieldDiff, objKey, diffMapChangedFields)}
            >
                {diffMapChangedFields.length < 1 ? (
                    <NoChanges />
                ) : (
                    <ListFields objKey={objKey} diffMap={diffMap} />
                )}
            </ObjectDiffContainer>
            <DiffSpacer height={1} />
        </>
    );
};

export default ObjectDiff;
