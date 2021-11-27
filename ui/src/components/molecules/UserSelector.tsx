import { FC, MouseEvent, useState } from 'react';
import { Avatar, Box, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import AvatarButton from '../atoms/AvatarButton';
import LogoutIcon from '../atoms/Icons/LogoutIcon';
import ProfileIcon from '../atoms/Icons/ProfileIcon';
import { UserSelectorProps } from '../../containers/global/LoggedInSection';

const UserSelector: FC<UserSelectorProps> = (props: UserSelectorProps) => {
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
                    vertical: 2,
                    horizontal: -15,
                }}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    disabled
                    sx={{
                        width: 300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                        opacity: '1!important',
                        flexDirection: 'column',
                    }}
                >
                    <Box pt={2}>
                        <Avatar
                            src={props.imgSrc}
                            sx={{
                                width: (theme) => theme.spacing(7),
                                height: (theme) => theme.spacing(7),
                            }}
                        />
                    </Box>
                    <Box
                        sx={{ color: (theme) => theme.palette.text.primary }}
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
