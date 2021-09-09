import { FC, Fragment } from 'react';
import { DiffMap, FieldDiff } from '../../../types/DiffTypes';
import FieldDiffSideBySide from './FieldDiffSideBySide';
import DiffSpacer from './DiffSpacer';

type ListFieldsProps = {
    objKey: string;
    diffMap: DiffMap;
};

const getDiffMapChangedFields = (key: string, diffMap: DiffMap): FieldDiff[] => {
    const diffFields = diffMap.get(key);
    if (diffFields !== undefined) {
        return diffFields.fields.filter((field) => field.hasChanges);
    }
    return [];
};

const ListFields: FC<ListFieldsProps> = (props: ListFieldsProps) => {
    const { objKey, diffMap } = props;
    const mapFields = getDiffMapChangedFields(objKey, diffMap);
    const standardFields = mapFields.filter((field) => !field.isRef && field.hasChanges);
    const refFields = mapFields.filter((field) => field.isRef && field.hasChanges);
    return (
        <>
            {standardFields.map((field, key) => (
                <Fragment key={key}>
                    <FieldDiffSideBySide fieldDiff={field} diffMap={props.diffMap} />
                    <DiffSpacer height={1} />
                </Fragment>
            ))}
            {refFields.map((field, key) => (
                <Fragment key={key}>
                    <FieldDiffSideBySide fieldDiff={field} diffMap={props.diffMap} />
                    <DiffSpacer height={1} />
                </Fragment>
            ))}
        </>
    );
};

export { ListFields, getDiffMapChangedFields };
