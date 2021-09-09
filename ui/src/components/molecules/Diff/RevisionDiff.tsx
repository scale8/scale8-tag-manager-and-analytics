import { FC } from 'react';
import { Box, DialogContent } from '@material-ui/core';
import { RevisionDiffElement } from '../../../types/DiffTypes';
import Diff from './Diff';
import { addHasChangesToDiffMap, revisionDiffsToMap } from '../../../utils/DiffUtils';
import { InfoButton, InfoProps } from '../InfoButton';
import InfoDialogTitle from '../InfoDialogTitle';

type RevisionDiffProps = {
    revisionLeftId: string;
    revisionRightId: string;
    revisionDiffs: RevisionDiffElement[];
    objKey: string;
    title: string;
    formInfoProps?: InfoProps;
    handleDialogClose: (checkChanges: boolean) => void;
};

const RevisionDiff: FC<RevisionDiffProps> = (props: RevisionDiffProps) => {
    const { revisionDiffs, objKey, revisionLeftId, revisionRightId, title, formInfoProps } = props;
    const revisionMap = revisionDiffsToMap(revisionDiffs);

    addHasChangesToDiffMap(objKey, revisionMap);

    return (
        <>
            <InfoDialogTitle fullscreen handleDialogClose={props.handleDialogClose}>
                {title}
                {formInfoProps !== undefined && <InfoButton {...formInfoProps} />}
            </InfoDialogTitle>
            <DialogContent
                style={{
                    margin: 0,
                    padding: 0,
                }}
                dividers
            >
                <Box p={3}>
                    <Diff
                        objKey={objKey}
                        diffMap={revisionMap}
                        prefix="Revision"
                        leftId={revisionLeftId}
                        rightId={revisionRightId}
                    />
                </Box>
            </DialogContent>
        </>
    );
};

export { RevisionDiff };
