import { FC } from 'react';
import { Box, lighten, Theme } from '@mui/material';
import { DiffMap, FieldDiff } from '../../../types/DiffTypes';
import ScalarFieldDisplay from './ScalarFieldDisplay';
import ArrayFieldDisplay from './ArrayFieldDisplay';
import { SxProps } from '@mui/system';

const FieldValuesComparison: FC<{
    fieldDiff: FieldDiff;
    diffMap?: DiffMap;
}> = ({ fieldDiff, diffMap }) => {
    if (!fieldDiff.hasChanges) {
        return null;
    }

    const comparisonSideContent: SxProps<Theme> = {
        flexGrow: 1,
        padding: 1,
        wordBreak: 'break-word',
        '& small': {
            color: '#666666',
        },
    };

    const isRemoved =
        fieldDiff.left.length > 0 &&
        !fieldDiff.leftIsArray &&
        !(fieldDiff.right[0] === fieldDiff.left[0] && !fieldDiff.rightIsArray);

    const isAdded =
        fieldDiff.right.length > 0 &&
        !fieldDiff.rightIsArray &&
        !(fieldDiff.right[0] === fieldDiff.left[0] && !fieldDiff.leftIsArray);

    return (
        <Box
            sx={{
                display: 'flex',
            }}
        >
            <Box
                sx={{
                    flex: '50%',
                    display: 'flex',
                    flexShrink: 0,
                    borderRight: '1px solid #e1e4e8',
                    '&::before': isRemoved
                        ? {
                              display: 'flex',
                              justifyContent: 'center',
                              alignContent: 'center',
                              flexDirection: 'column',
                              textAlign: 'center',
                              width: '35px',
                              flexShrink: 0,
                              content: '"—"',
                              backgroundColor: (theme) => lighten(theme.palette.error.main, 0.9),
                              color: (theme) => theme.palette.error.main,
                          }
                        : {},
                }}
            >
                <Box sx={comparisonSideContent}>
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
                </Box>
            </Box>
            <Box
                sx={{
                    flex: '50%',
                    display: 'flex',
                    flexShrink: 0,
                    '&::before': isAdded
                        ? {
                              display: 'flex',
                              justifyContent: 'center',
                              alignContent: 'center',
                              flexDirection: 'column',
                              textAlign: 'center',
                              width: '35px',
                              flexShrink: 0,
                              content: '"＋"',
                              backgroundColor: (theme) => lighten(theme.palette.success.main, 0.9),
                              color: (theme) => theme.palette.success.main,
                              fontWeight: 'bold',
                          }
                        : {},
                }}
            >
                <Box sx={comparisonSideContent}>
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
                </Box>
            </Box>
        </Box>
    );
};

export default FieldValuesComparison;
