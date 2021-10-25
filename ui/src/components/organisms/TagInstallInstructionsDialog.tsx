import { FC } from 'react';
import { Box, DialogContent, DialogContentText } from '@mui/material';
import CopyBlock from '../atoms/CopyBlock';
import { buildTagInstallMarkup } from '../../utils/TextUtils';
import DialogActionsWithCancel from '../molecules/DialogActionsWithCancel';
import Alert from '@mui/material/Alert';

export type TagInstallInstructionsDialogProps = {
    handleDialogClose: (checkChanges: boolean) => void;
    name: string;
    code: string;
    type: string;
    autoLoad: boolean;
};

const TagInstallInstructionsDialog: FC<TagInstallInstructionsDialogProps> = (
    props: TagInstallInstructionsDialogProps,
) => {
    if (props.autoLoad) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <DialogContent>
                    <Alert severity="info">
                        This tag will be loaded automatically when you load your environment.
                        <br />
                        Please make sure you have installed your environment code in the head of
                        your page.
                    </Alert>
                </DialogContent>
                <DialogActionsWithCancel handleDialogClose={props.handleDialogClose} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <DialogContent>
                <DialogContentText component="div" id="alert-dialog-description">
                    Please install the following tag in the appropriate place:
                    <Box fontSize={12} my={1}>
                        <CopyBlock
                            text={buildTagInstallMarkup(props.name, props.code, props.type)}
                            language="html"
                        />
                    </Box>
                    Please make sure you have installed your environment code in the head of your
                    page.
                </DialogContentText>
            </DialogContent>
            <DialogActionsWithCancel handleDialogClose={props.handleDialogClose} />
        </Box>
    );
};

export default TagInstallInstructionsDialog;
