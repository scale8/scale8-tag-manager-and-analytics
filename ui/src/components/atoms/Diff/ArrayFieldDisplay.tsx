import { FC } from 'react';
import clsx from 'clsx';
import { Box, lighten } from '@mui/material';
import { DiffMap } from '../../../types/DiffTypes';
import ItemLabel from './ItemLabel';

const ArrayFieldDisplay: FC<{
    fieldName: string;
    thisSide: string[];
    otherSide: string[];
    thisSideIsArray: boolean;
    otherSideIsArray: boolean;
    isLeft: boolean;
    diffMap?: DiffMap;
}> = ({ thisSide, otherSide, thisSideIsArray, otherSideIsArray, isLeft, diffMap }) => {
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
            <Box
                sx={{
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {thisSide.length < 1 ? (
                    <Box
                        sx={{
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderTop: 0,
                            width: '100%',
                            flexGrow: 0,
                            display: 'flex',
                        }}
                    >
                        <Box
                            p={1}
                            sx={{
                                flexGrow: 1,
                                wordBreak: 'break-word',
                                color: '#cccccc',
                            }}
                        >
                            Empty
                        </Box>
                    </Box>
                ) : (
                    thisSide.map((value, key: number) => (
                        <Box
                            key={key}
                            sx={{
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                                borderTop: 0,
                                width: '100%',
                                flexGrow: 0,
                                display: 'flex',
                                '&.arraySwapped::before': {
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
                                '&.arrayRemoved::before': {
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    flexDirection: 'column',
                                    textAlign: 'center',
                                    width: '35px',
                                    flexShrink: 0,
                                    content: '"—"',
                                    backgroundColor: (theme) =>
                                        lighten(theme.palette.error.main, 0.9),
                                    color: (theme) => theme.palette.error.main,
                                },
                                '&.arrayAdded::before': {
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    flexDirection: 'column',
                                    textAlign: 'center',
                                    width: '35px',
                                    flexShrink: 0,
                                    content: '"＋"',
                                    backgroundColor: (theme) =>
                                        lighten(theme.palette.success.main, 0.9),
                                    color: (theme) => theme.palette.success.main,
                                    fontWeight: 'bold',
                                },
                            }}
                            className={clsx(
                                {
                                    arrayRemoved: checkIfRemoved(value, key),
                                },
                                {
                                    arrayAdded: checkIfAdded(value, key),
                                },
                                {
                                    arraySwapped: checkIfSwapped(value, key),
                                },
                            )}
                        >
                            <Box
                                p={1}
                                sx={{
                                    flexGrow: 1,
                                    wordBreak: 'break-word',
                                }}
                            >
                                <ItemLabel diffMap={diffMap} objKey={value} />
                            </Box>
                        </Box>
                    ))
                )}
            </Box>
        </>
    );
};
export default ArrayFieldDisplay;
