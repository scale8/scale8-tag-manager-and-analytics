import { FC } from 'react';
import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DiffMap, FieldDiff } from '../../../types/DiffTypes';
import ObjectDiff from './ObjectDiff';
import FieldContainer from './FieldContainer';
import FieldValuesComparison from './FieldValuesComparison';
import DiffSpacer from './DiffSpacer';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
        },
        refSection: {},
        sectionTitle: {
            backgroundColor: '#eeeeee',
            border: '1px solid #e1e4e8',
            padding: theme.spacing(1),
        },
        refSectionContent: {
            borderLeft: '1px solid #e1e4e8',
            borderRight: '1px solid #e1e4e8',
            borderBottom: '1px solid #e1e4e8',
        },
        objSectionContent: {
            padding: theme.spacing(1, 1, 0),
            borderLeft: '1px dashed #e1e4e8',
            borderRight: '1px dashed #e1e4e8',
            borderBottom: '1px dashed #e1e4e8',
        },
    }),
);

const FieldDiffSideBySide: FC<{
    fieldDiff: FieldDiff;
    diffMap: DiffMap;
}> = (props: { fieldDiff: FieldDiff; diffMap: DiffMap }) => {
    const classes = useStyles();
    const { fieldDiff, diffMap } = props;

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
                <div className={classes.root}>
                    <div className={classes.refSection}>
                        <div className={classes.sectionTitle}>Linked References</div>
                        <div className={classes.refSectionContent}>
                            <FieldValuesComparison fieldDiff={fieldDiff} diffMap={diffMap} />
                        </div>
                    </div>
                    <DiffSpacer height={2} />
                    <div className={classes.refSection}>
                        <div className={classes.sectionTitle}>Linked Objects</div>
                        <div className={classes.objSectionContent}>
                            {objectKeys.map((objKey) => (
                                <ObjectDiff
                                    key={objKey}
                                    objKey={objKey}
                                    diffMap={diffMap}
                                    fieldDiff={fieldDiff}
                                />
                            ))}
                        </div>
                    </div>
                </div>
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
