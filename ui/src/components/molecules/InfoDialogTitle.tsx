import { FC, ReactNode } from 'react';
import { DialogTitle, IconButton, Typography } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles((theme) =>
    createStyles({
        title: {
            flex: 1,
        },
        titleWithMargin: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: '11px',
            color: theme.palette.grey[500],
        },
    }),
);

type InfoDialogTitleProps = {
    children: ReactNode;
    fullscreen?: boolean;
    handleDialogClose: (checkChanges: boolean) => void;
};

const InfoDialogTitle: FC<InfoDialogTitleProps> = (props: InfoDialogTitleProps) => {
    const classes = useStyles();

    return (
        <DialogTitle style={{ display: 'flex', height: 68 }}>
            <Typography
                component="div"
                variant="h6"
                className={
                    props.fullscreen !== undefined && props.fullscreen
                        ? classes.titleWithMargin
                        : classes.title
                }
            >
                {props.children}
            </Typography>
            <IconButton
                onClick={() => props.handleDialogClose(true)}
                className={classes.closeButton}
                aria-label="close"
                size="large"
            >
                <CloseIcon />
            </IconButton>
        </DialogTitle>
    );
};

export default InfoDialogTitle;
