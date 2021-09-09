import { FC, MouseEventHandler } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 0,
        width: theme.spacing(4.5),
        height: theme.spacing(4.5),
    },
    avatar: {
        width: theme.spacing(4.5),
        height: theme.spacing(4.5),
    },
}));

type AvatarButtonProps = {
    loading: boolean;
    imgSrc?: string;
    handleClick: MouseEventHandler;
};

const AvatarButton: FC<AvatarButtonProps> = (props: AvatarButtonProps) => {
    const classes = useStyles();

    return (
        <IconButton
            className={classes.root}
            color="inherit"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={props.handleClick}
        >
            {!props.loading && <Avatar src={props.imgSrc} className={classes.avatar} />}
        </IconButton>
    );
};
export default AvatarButton;
