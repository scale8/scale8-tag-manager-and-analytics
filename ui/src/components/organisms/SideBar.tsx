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

const SideBar: FC<SideBarProps> = (props: SideBarProps) => {
    const router = useRouter();

    const { templateInteractions } = useLoggedInState();
    const { section } = templateInteractions;

    const inAdmin = section === SectionKey.admin;

    const CurrentLogo = logoFromSectionLocator(section);

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
            <Box height={50} />
            <Box>{props.children}</Box>
            <Box
                sx={{
                    flexGrow: 1,
                    alignSelf: 'center',
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '50px',
                }}
            >
                {props.isAdmin && (
                    <Box>
                        <Tooltip title="Admin Area" placement="right">
                            <IconButton
                                sx={{
                                    color: (theme) =>
                                        inAdmin ? theme.palette.adminColor.main : 'white',
                                }}
                                onClick={() => {
                                    if (inAdmin) {
                                        router
                                            .push(
                                                localStorage.getItem('adminAreaFrom') ?? toOrgList,
                                            )
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
                <Box>
                    <Tooltip title="Manage Organizations" placement="right">
                        <Box>
                            <IconButton
                                sx={{
                                    color: 'white',
                                }}
                                color="inherit"
                                onClick={() => {
                                    router.push(toOrgList).then();
                                }}
                                size="large"
                            >
                                <OrgIcon />
                            </IconButton>
                        </Box>
                    </Tooltip>
                </Box>
                <Box>
                    <Tooltip title="Notifications" placement="right">
                        <IconButton
                            sx={{
                                color: 'white',
                            }}
                            color="inherit"
                            onClick={props.handleNotificationClick}
                            size="large"
                        >
                            <Badge badgeContent={props.unreadNotifications} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box height={20} />
                <UserSelector {...props.userSelectorProps} />
                <Box height={15} />
            </Box>
        </Box>
    );
};

export default SideBar;
