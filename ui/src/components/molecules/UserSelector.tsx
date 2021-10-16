import { FC, MouseEvent, useState } from 'react';
import {
    Avatar,
    Box,
    ListItemIcon,
    Menu,
    MenuItem,
    Theme,
    Typography,
    useTheme,
} from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import AvatarButton from '../atoms/AvatarButton';
import makeStyles from '@mui/styles/makeStyles';
import LogoutIcon from '../atoms/Icons/LogoutIcon';
import ProfileIcon from '../atoms/Icons/ProfileIcon';
import { UserSelectorProps } from '../../containers/global/LoggedInSection';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
        },
        large: {
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
        menuContent: {
            width: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            opacity: '1!important',
            flexDirection: 'column',
        },
        avatarLarge: {
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
    }),
);

const UserSelector: FC<UserSelectorProps> = (props: UserSelectorProps) => {
    const theme = useTheme();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (!props.loading) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AvatarButton loading={props.loading} imgSrc={props.imgSrc} handleClick={handleClick} />
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 80,
                    horizontal: -2,
                }}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem disabled className={classes.menuContent}>
                    <Box pt={2}>
                        <Avatar src={props.imgSrc} className={classes.large} />
                    </Box>
                    <Box
                        color={theme.palette.text.primary}
                        pt={2}
                        textOverflow="ellipsis"
                        overflow="hidden"
                    >
                        <Typography variant="inherit" noWrap>
                            {props.userName}
                        </Typography>
                    </Box>
                    <Box
                        fontSize={12}
                        maxWidth="100%"
                        color="grey.600"
                        pb={2}
                        textOverflow="ellipsis"
                        overflow="hidden"
                    >
                        <Typography variant="inherit" noWrap>
                            {props.userEmail}
                        </Typography>
                    </Box>
                </MenuItem>
                <MenuItem
                    onClick={(e: MouseEvent) => {
                        props.handleAccountClick(e);
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <ProfileIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Manage account</Typography>
                </MenuItem>
                <MenuItem
                    onClick={(e: MouseEvent) => {
                        props.handleLogoutClick(e);
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Logout</Typography>
                </MenuItem>
            </Menu>
        </>
    );
};

export { UserSelector };
