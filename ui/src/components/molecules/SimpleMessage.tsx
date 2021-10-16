import makeStyles from '@mui/styles/makeStyles';
import { FC, ReactNode } from 'react';
import { DialogContent } from '@mui/material';
import DialogActionsWithCancel from './DialogActionsWithCancel';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        width: '100%',
        margin: theme.spacing(0, 0, 3),
    },
    dialogContent: {
        minHeight: '100px',
    },
}));

type SimpleMessageProps = {
    children: ReactNode;
    handleDialogClose: (checkChanges: boolean) => void;
};

const SimpleMessage: FC<SimpleMessageProps> = (props: SimpleMessageProps) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <DialogContent className={classes.dialogContent}>{props.children}</DialogContent>
            <DialogActionsWithCancel handleDialogClose={props.handleDialogClose} />
        </div>
    );
};

export default SimpleMessage;
