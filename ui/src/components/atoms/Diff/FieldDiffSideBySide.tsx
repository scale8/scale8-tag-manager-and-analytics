import { FC } from 'react';
import { Box } from '@mui/material';
import { DiffMap, FieldDiff } from '../../../types/DiffTypes';
import ObjectDiff from './ObjectDiff';
import FieldContainer from './FieldContainer';
import FieldValuesComparison from './FieldValuesComparison';
import DiffSpacer from './DiffSpacer';

const FieldDiffSideBySide: FC<{
    fieldDiff: FieldDiff;
    diffMap: DiffMap;
}> = ({ fieldDiff, diffMap }) => {
    if (!fieldDiff.hasChanges) {
        return null;
    }

    if (fieldDiff.isRef) {
        const objectKeys = [
            ...Array.from(new Set([...(fieldDiff.left || []), ...(fieldDiff.right || [])])),
        ];

        return (
            <FieldContainer
                field={fieldDiff.field}
                leftEmpty={fieldDiff.left.length < 1}
                rightEmpty={fieldDiff.right.length < 1}
            >
                <Box p={2}>
                    <div>
                        <Box
                            p={1}
                            sx={{
                                backgroundColor: '#eeeeee',
                                border: '1px solid #e1e4e8',
                            }}
                        >
                            Linked References
                        </Box>
                        <Box
                            sx={{
                                borderLeft: '1px solid #e1e4e8',
                                borderRight: '1px solid #e1e4e8',
                                borderBottom: '1px solid #e1e4e8',
                            }}
                        >
                            <FieldValuesComparison fieldDiff={fieldDiff} diffMap={diffMap} />
                        </Box>
                    </div>
                    <DiffSpacer height={2} />
                    <div>
                        <Box
                            p={1}
                            sx={{
                                backgroundColor: '#eeeeee',
                                border: '1px solid #e1e4e8',
                            }}
                        >
                            Linked Objects
                        </Box>
                        <Box
                            sx={{
                                padding: (theme) => theme.spacing(1, 1, 0),
                                borderLeft: '1px dashed #e1e4e8',
                                borderRight: '1px dashed #e1e4e8',
                                borderBottom: '1px dashed #e1e4e8',
                            }}
                        >
                            {objectKeys.map((objKey) => (
                                <ObjectDiff
                                    key={objKey}
                                    objKey={objKey}
                                    diffMap={diffMap}
                                    fieldDiff={fieldDiff}
                                />
                            ))}
                        </Box>
                    </div>
                </Box>
            </FieldContainer>
        );
    }

    return (
        <FieldContainer
            field={fieldDiff.field}
            leftEmpty={fieldDiff.left.length < 1}
            rightEmpty={fieldDiff.right.length < 1}
        >
            <FieldValuesComparison fieldDiff={fieldDiff} />
        </FieldContainer>
    );
};

export default FieldDiffSideBySide;
