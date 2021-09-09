import { FC } from 'react';
import clsx from 'clsx';
import { createStyles, lighten, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DiffMap, FieldDiff } from '../../../types/DiffTypes';
import ScalarFieldDisplay from './ScalarFieldDisplay';
import ArrayFieldDisplay from './ArrayFieldDisplay';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        comparison: {
            display: 'flex',
        },
        removed: {},
        added: {},
        left: { borderRight: '1px solid #e1e4e8' },
        right: {},
        comparisonSide: {
            flex: '50%',
            display: 'flex',
            flexShrink: 0,
            '&$removed::before': {
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                width: '35px',
                flexShrink: 0,
                content: '"—"',
                backgroundColor: lighten(theme.palette.error.main, 0.9),
                color: theme.palette.error.main,
            },
            '&$added::before': {
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                width: '35px',
                flexShrink: 0,
                content: '"＋"',
                backgroundColor: lighten(theme.palette.success.main, 0.9),
                color: theme.palette.success.main,
                fontWeight: 'bold',
            },
        },
        comparisonSideContent: {
            flexGrow: 1,
            padding: theme.spacing(1),
            wordBreak: 'break-word',
            '& small': {
                color: '#666666',
            },
        },
    }),
);

const FieldValuesComparison: FC<{
    fieldDiff: FieldDiff;
    diffMap?: DiffMap;
}> = (props: { fieldDiff: FieldDiff; diffMap?: DiffMap }) => {
    const classes = useStyles();
    const { fieldDiff, diffMap } = props;

    if (!fieldDiff.hasChanges) {
        return null;
    }

    return (
        <div className={classes.comparison}>
            <div
                className={clsx(classes.comparisonSide, classes.left, {
                    [classes.removed]:
                        fieldDiff.left.length > 0 &&
                        !fieldDiff.leftIsArray &&
                        !(fieldDiff.right[0] === fieldDiff.left[0] && !fieldDiff.rightIsArray),
                })}
            >
                <div className={classes.comparisonSideContent}>
                    <ScalarFieldDisplay
                        fieldIsArray={fieldDiff.leftIsArray}
                        fieldLength={fieldDiff.left.length}
                        fieldValue={fieldDiff.left[0]}
                        diffMap={diffMap}
                    />
                    <ArrayFieldDisplay
                        fieldName={fieldDiff.field}
                        thisSide={fieldDiff.left}
                        otherSide={fieldDiff.right}
                        thisSideIsArray={fieldDiff.leftIsArray}
                        otherSideIsArray={fieldDiff.rightIsArray}
                        isLeft={true}
                        diffMap={diffMap}
                    />
                </div>
            </div>
            <div
                className={clsx(classes.comparisonSide, classes.right, {
                    [classes.added]:
                        fieldDiff.right.length > 0 &&
                        !fieldDiff.rightIsArray &&
                        !(fieldDiff.right[0] === fieldDiff.left[0] && !fieldDiff.leftIsArray),
                })}
            >
                <div className={classes.comparisonSideContent}>
                    <ScalarFieldDisplay
                        fieldIsArray={fieldDiff.rightIsArray}
                        fieldLength={fieldDiff.right.length}
                        fieldValue={fieldDiff.right[0]}
                        diffMap={diffMap}
                    />
                    <ArrayFieldDisplay
                        fieldName={fieldDiff.field}
                        thisSide={fieldDiff.right}
                        otherSide={fieldDiff.left}
                        thisSideIsArray={fieldDiff.rightIsArray}
                        otherSideIsArray={fieldDiff.leftIsArray}
                        isLeft={false}
                        diffMap={diffMap}
                    />
                </div>
            </div>
        </div>
    );
};

export default FieldValuesComparison;
