import { FC, MouseEventHandler } from 'react';
import { Avatar, IconButton } from '@mui/material';

type AvatarButtonProps = {
    loading: boolean;
    imgSrc?: string;
    handleClick: MouseEventHandler;
};

const AvatarButton: FC<AvatarButtonProps> = (props: AvatarButtonProps) => {
    return (
        <IconButton
            sx={{
                padding: 0,
                width: (theme) => theme.spacing(4.5),
                height: (theme) => theme.spacing(4.5),
            }}
            color="inherit"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={props.handleClick}
            size="large"
        >
            {!props.loading && (
                <Avatar
                    src={props.imgSrc}
                    sx={{
                        width: (theme) => theme.spacing(4.5),
                        height: (theme) => theme.spacing(4.5),
                    }}
                />
            )}
        </IconButton>
    );
};
export default AvatarButton;
