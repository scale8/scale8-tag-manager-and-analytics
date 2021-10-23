import { FC } from 'react';
import { DiffMap } from '../../../types/DiffTypes';
import ItemLabel from './ItemLabel';

type ScalarFieldDisplayProps = {
    fieldLength: number;
    fieldIsArray: boolean;
    fieldValue: string;
    diffMap?: DiffMap;
};

const ScalarFieldDisplay: FC<ScalarFieldDisplayProps> = (props: ScalarFieldDisplayProps) => {
    const { fieldLength, fieldIsArray, fieldValue, diffMap } = props;

    if (fieldLength < 1 || fieldIsArray) {
        return null;
    }

    return (
        <span className="value">
            <ItemLabel diffMap={diffMap} objKey={fieldValue} />
        </span>
    );
};

export default ScalarFieldDisplay;
