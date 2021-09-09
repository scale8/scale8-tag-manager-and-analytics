import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { UserSelector } from '../molecules/UserSelector';
import { Badge, Box, IconButton, Tooltip } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import clsx from 'clsx';
import OrgIcon from '../atoms/Icons/OrgIcon';
import { logoFromSectionLocator, SectionKey } from '../../containers/SectionsDetails';
import { useLoggedInState } from '../../context/AppContext';
import { SideBarProps } from '../../containers/global/LoggedInSection';
import { useRouter } from 'next/router';
import { toAdmin, toOrgList } from '../../utils/NavigationPaths';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        display: 'flex',
        boxSizing: 'border-box',
        flexDirection: 'column',
        backgroundColor: theme.palette.primary.main,
        flexGrow: 0,
        width: '50px',
        height: '100vh',
    },
    main: {
        flexGrow: 1,
        alignSelf: 'center',
    },
    logo: {
        paddingTop: '15px',
        alignSelf: 'center',
        alignItems: 'center',
        width: 27,
        height: 50,
        cursor: 'pointer',
    },
    logoButton: {
        padding: '0px',
    },
    admin: {
        display: 'flex',
        width: '64px',
        height: '48px',
        color: 'white',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        marginBottom: '10px',
        '&$adminOn': {
            color: theme.palette.adminColor.main,
        },
    },
    adminOn: {},
    iconButton: {
        display: 'flex',
        width: '64px',
        height: '48px',
        color: 'white',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        marginBottom: '10px',
    },
    userSelector: {
        display: 'flex',
        width: '64px',
        height: '48px',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        marginBottom: '10px',
    },
}));

const SideBar: FC<SideBarProps> = (props: SideBarProps) => {
    const classes = useStyles();
    const router = useRouter();

    const { templateInteractions } = useLoggedInState();
    const { sectionHistory } = templateInteractions;

    const inAdmin = sectionHistory.current?.section === SectionKey.admin;

    const CurrentLogo = logoFromSectionLocator(sectionHistory.current);

    return (
        <div className={classes.root}>
            <div
                className={classes.logo}
                onClick={() => {
                    router.push(toOrgList).then();
                }}
            >
                <CurrentLogo width={27} />
            </div>
            <div className={classes.main} />
            {props.isAdmin && (
                <div className={clsx(classes.admin, inAdmin && classes.adminOn)}>
                    <Tooltip title="Admin Area" placement="right">
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                if (inAdmin) {
                                    router
                                        .push(localStorage.getItem('adminAreaFrom') ?? toOrgList)
                                        .then();
                                } else {
                                    localStorage.setItem('adminAreaFrom', location.href);
                                    router.push(toAdmin).then();
                                }
                            }}
                        >
                            <SettingsApplicationsIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            )}
            <div className={classes.iconButton}>
                <Box>
                    <Tooltip title="Manage Organizations" placement="right">
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                router.push(toOrgList).then();
                            }}
                        >
                            <OrgIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </div>
            <div className={classes.iconButton}>
                <Tooltip title="Notifications" placement="right">
                    <Box>
                        <IconButton color="inherit" onClick={props.handleNotificationClick}>
                            <Badge badgeContent={props.unreadNotifications} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Box>
                </Tooltip>
            </div>
            <div className={classes.userSelector}>
                <UserSelector {...props.userSelectorProps} />
            </div>
        </div>
    );
};

export default SideBar;
