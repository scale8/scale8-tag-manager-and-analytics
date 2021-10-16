import { FC } from 'react';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { DiffMap } from '../../../types/DiffTypes';
import ItemLabel from './ItemLabel';

const useStyles = makeStyles(() =>
    createStyles({
        value: {},
    }),
);

type ScalarFieldDisplayProps = {
    fieldLength: number;
    fieldIsArray: boolean;
    fieldValue: string;
    diffMap?: DiffMap;
};

const ScalarFieldDisplay: FC<ScalarFieldDisplayProps> = (props: ScalarFieldDisplayProps) => {
    const classes = useStyles();
    const { fieldLength, fieldIsArray, fieldValue, diffMap } = props;

    if (fieldLength < 1 || fieldIsArray) {
        return null;
    }

    return (
        <span className={classes.value}>
            <ItemLabel diffMap={diffMap} objKey={fieldValue} />
        </span>
    );
};

export default ScalarFieldDisplay;
