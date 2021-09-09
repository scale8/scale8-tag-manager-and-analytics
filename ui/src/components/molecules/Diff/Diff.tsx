import { FC } from 'react';
import { DiffMap } from '../../../types/DiffTypes';
import { getDiffMapChangedFields, ListFields } from '../../atoms/Diff/ListFields';
import MainDiffContainer from '../../atoms/Diff/MainDiffContainer';

type ObjectDiffProps = {
    prefix?: string;
    objKey: string;
    diffMap: DiffMap;
    leftId: string;
    rightId: string;
};

const Diff: FC<ObjectDiffProps> = (props: ObjectDiffProps) => {
    const { prefix, objKey, diffMap, leftId, rightId } = props;

    if (getDiffMapChangedFields(objKey, diffMap).length < 1) {
        return null;
    }

    let leftName;
    let rightName;

    const platformDiff = diffMap.get(objKey);

    if (platformDiff !== undefined) {
        const nameField = platformDiff.fields.find((field) => field.field === 'name');

        if (nameField !== undefined) {
            leftName = nameField.left[0];
            rightName = nameField.right[0];
        }
    }

    return (
        <>
            <MainDiffContainer
                leftId={leftId}
                rightId={rightId}
                leftName={leftName}
                rightName={rightName}
                prefix={prefix}
            >
                <ListFields objKey={objKey} diffMap={diffMap} />
            </MainDiffContainer>
        </>
    );
};

export default Diff;
