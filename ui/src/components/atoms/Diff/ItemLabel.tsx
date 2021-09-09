import { FC } from 'react';
import { DiffMap } from '../../../types/DiffTypes';
import { removeStringQuotes } from '../../../utils/TextUtils';

const ItemLabel: FC<{ objKey: string; diffMap?: DiffMap }> = (props: {
    objKey: string;
    diffMap?: DiffMap;
}) => {
    const { objKey, diffMap } = props;
    if (diffMap) {
        const objectDiff = diffMap.get(objKey);

        if (objectDiff !== undefined) {
            const nameField = objectDiff.fields.find((field) => field.field === 'name');
            if (nameField !== undefined) {
                return (
                    <>
                        {removeStringQuotes(
                            nameField.right.length > 0 ? nameField.right[0] : nameField.left[0],
                        )}{' '}
                        <small>({objKey})</small>
                    </>
                );
            }
        }
    }

    return <>{objKey}</>;
};

export default ItemLabel;
