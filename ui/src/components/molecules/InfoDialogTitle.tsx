import { FC, ReactNode } from 'react';
import { DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type InfoDialogTitleProps = {
    children: ReactNode;
    fullscreen?: boolean;
    handleDialogClose: (checkChanges: boolean) => void;
};

const InfoDialogTitle: FC<InfoDialogTitleProps> = (props: InfoDialogTitleProps) => {
    return (
        <DialogTitle sx={{ display: 'flex', height: 68 }}>
            <Typography
                component="div"
                variant="h6"
                sx={{
                    flex: 1,
                    marginLeft: (theme) =>
                        props.fullscreen !== undefined && props.fullscreen
                            ? theme.spacing(2)
                            : undefined,
                }}
            >
                {props.children}
            </Typography>
            <IconButton
                onClick={() => props.handleDialogClose(true)}
                sx={{
                    position: 'absolute',
                    right: (theme) => theme.spacing(1),
                    top: '11px',
                    color: (theme) => theme.palette.grey[500],
                }}
                aria-label="close"
                size="large"
            >
                <CloseIcon />
            </IconButton>
        </DialogTitle>
    );
};

export default InfoDialogTitle;
