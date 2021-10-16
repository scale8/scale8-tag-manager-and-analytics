import { FC } from 'react';
import clsx from 'clsx';
import { lighten, Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { DiffMap } from '../../../types/DiffTypes';
import ItemLabel from './ItemLabel';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        array: {
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        arrayElement: {
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderTop: 0,
            width: '100%',
            flexGrow: 0,
            display: 'flex',
        },
        arraySwapped: {
            '&::before': {
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                width: '35px',
                flexShrink: 0,
                content: '"⮃"',
                backgroundColor: '#eeeeee',
            },
        },
        arrayRemoved: {
            '&::before': {
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
        },
        arrayAdded: {
            '&::before': {
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
        arrayEmpty: {
            color: '#cccccc',
        },
        arrayContent: {
            flexGrow: 1,
            padding: theme.spacing(1),
            wordBreak: 'break-word',
        },
    }),
);

type ArrayFieldDisplayProps = {
    fieldName: string;
    thisSide: string[];
    otherSide: string[];
    thisSideIsArray: boolean;
    otherSideIsArray: boolean;
    isLeft: boolean;
    diffMap?: DiffMap;
};

const ArrayFieldDisplay: FC<ArrayFieldDisplayProps> = (props: ArrayFieldDisplayProps) => {
    const classes = useStyles();
    const { thisSide, otherSide, thisSideIsArray, otherSideIsArray, isLeft, diffMap } = props;

    if (!thisSideIsArray) {
        return null;
    }

    const checkIfSwapped = (value: string, key: number) => {
        if (otherSide[key] === value) return false;
        const thisOccurrences = thisSide.filter((_) => _ === value).length;
        const otherOccurrences = otherSide.filter((_) => _ === value).length;
        if (otherOccurrences === 0) return false;
        // some of these are not on the other side
        if (thisOccurrences > otherOccurrences) {
            // Occurrences before the current key are less then occurrences on the other side
            return thisSide.splice(0, key).filter((_) => _ === value).length < otherOccurrences;
        } else {
            // If the occurrences on this side are less or the same as the other side all are swaps
            return true;
        }
    };

    const checkIfRemoved = (value: string, key: number) => {
        if (!isLeft) {
            return false;
        }
        if (!otherSideIsArray) {
            return true;
        }
        // same value same position
        if (otherSide[key] === value) return false;
        return !checkIfSwapped(value, key);
    };

    const checkIfAdded = (value: string, key: number) => {
        if (isLeft) {
            return false;
        }
        if (!otherSideIsArray) {
            return true;
        }
        if (otherSide[key] === value) return false;
        return !checkIfSwapped(value, key);
    };

    return (
        <>
            <div className={classes.array}>
                {thisSide.length < 1 ? (
                    <div className={classes.arrayElement}>
                        <div className={clsx(classes.arrayContent, classes.arrayEmpty)}>Empty</div>
                    </div>
                ) : (
                    thisSide.map((value, key: number) => (
                        <div
                            key={key}
                            className={clsx(
                                classes.arrayElement,
                                {
                                    [classes.arrayRemoved]: checkIfRemoved(value, key),
                                },
                                {
                                    [classes.arrayAdded]: checkIfAdded(value, key),
                                },
                                {
                                    [classes.arraySwapped]: checkIfSwapped(value, key),
                                },
                            )}
                        >
                            <div className={classes.arrayContent}>
                                <ItemLabel diffMap={diffMap} objKey={value} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};
export default ArrayFieldDisplay;
