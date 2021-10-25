import { FC } from 'react';
import { UserSelector } from '../molecules/UserSelector';
import { Badge, Box, IconButton, Tooltip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import OrgIcon from '../atoms/Icons/OrgIcon';
import { logoFromSectionLocator, SectionKey } from '../../containers/SectionsDetails';
import { useLoggedInState } from '../../context/AppContext';
import { SideBarProps } from '../../containers/global/LoggedInSection';
import { useRouter } from 'next/router';
import { toAdmin, toOrgList } from '../../utils/NavigationPaths';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

const SideBar: FC<SideBarProps> = (props: SideBarProps) => {
    const router = useRouter();

    const { templateInteractions } = useLoggedInState();
    const { sectionHistory } = templateInteractions;

    const inAdmin = sectionHistory.current?.section === SectionKey.admin;

    const CurrentLogo = logoFromSectionLocator(sectionHistory.current);

    const iconButton: SxProps<Theme> = {
        display: 'flex',
        width: '64px',
        height: '48px',
        color: 'white',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        marginBottom: '10px',
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                display: 'flex',
                boxSizing: 'border-box',
                flexDirection: 'column',
                backgroundColor: (theme) => theme.palette.primary.main,
                flexGrow: 0,
                width: '50px',
                height: '100vh',
            }}
        >
            <Box
                sx={{
                    paddingTop: '15px',
                    alignSelf: 'center',
                    alignItems: 'center',
                    width: 27,
                    height: 50,
                    cursor: 'pointer',
                }}
                onClick={() => {
                    router.push(toOrgList).then();
                }}
            >
                <CurrentLogo width={27} />
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    alignSelf: 'center',
                }}
            />
            {props.isAdmin && (
                <Box
                    sx={{
                        display: 'flex',
                        width: '64px',
                        height: '48px',
                        color: (theme) => (inAdmin ? theme.palette.adminColor.main : 'white'),
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        marginBottom: '10px',
                    }}
                >
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
                            size="large"
                        >
                            <SettingsApplicationsIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
            <Box sx={iconButton}>
                <Box>
                    <Tooltip title="Manage Organizations" placement="right">
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                router.push(toOrgList).then();
                            }}
                            size="large"
                        >
                            <OrgIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Box sx={iconButton}>
                <Tooltip title="Notifications" placement="right">
                    <Box>
                        <IconButton
                            color="inherit"
                            onClick={props.handleNotificationClick}
                            size="large"
                        >
                            <Badge badgeContent={props.unreadNotifications} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Box>
                </Tooltip>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    width: '64px',
                    height: '48px',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    marginBottom: '10px',
                }}
            >
                <UserSelector {...props.userSelectorProps} />
            </Box>
        </Box>
    );
};

export default SideBar;
