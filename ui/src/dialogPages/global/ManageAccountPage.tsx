import { ChangeEvent, FC, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import { Box, Theme } from '@mui/material';
import Tab from '@mui/material/Tab';
import { PersonalInfoUpdate } from './PersonalInfoUpdate';
import { ChangePassword } from './ChangePassword';
import { GithubAccount } from './GithubAccount';
import { TwoFactor } from './TwoFactor';
import { APIToken } from './APIToken';
import { DialogPageProps } from '../../types/DialogTypes';
import TabsTabPanel from '../../components/molecules/TabsTabPanel';
import { AccountDelete } from './AccountDelete';
import { ChangeEmail } from './ChangeEmail';
import { useConfigState } from '../../context/AppContext';
import { SxProps } from '@mui/system';

const ManageAccountPage: FC<DialogPageProps> = (props: DialogPageProps) => {
    const [value, setValue] = useState(0);
    const { useGithubSSO, useTwoFactorAuth } = useConfigState();

    const handleChange = (event: ChangeEvent<unknown>, newValue: number) => {
        setValue(newValue);
    };

    const tabStyle: SxProps<Theme> = {
        minHeight: 35,
        alignItems: 'flex-start',
        whiteSpace: 'nowrap',
    };

    return (
        <Box minWidth={560} maxWidth={560} minHeight={320} display="flex">
            <Tabs
                sx={{
                    paddingTop: '5px',
                    borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                }}
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                orientation="vertical"
            >
                <Tab label="Personal info" sx={tabStyle} wrapped />
                <Tab label="Change Password" sx={tabStyle} wrapped />
                <Tab label="Change Email" sx={tabStyle} wrapped />
                {useGithubSSO && <Tab label="GitHub Account" sx={tabStyle} wrapped />}
                {useTwoFactorAuth && <Tab label="2-Factor Auth" sx={tabStyle} wrapped />}
                <Tab label="API Token" sx={tabStyle} wrapped />
                <Tab label="Delete Account" sx={tabStyle} wrapped />
            </Tabs>
            <Box minWidth={400} maxWidth={400} minHeight={320}>
                <TabsTabPanel value={value} index={0}>
                    <PersonalInfoUpdate {...props} />
                </TabsTabPanel>
                <TabsTabPanel value={value} index={1}>
                    <ChangePassword {...props} />
                </TabsTabPanel>
                <TabsTabPanel value={value} index={2}>
                    <ChangeEmail {...props} />
                </TabsTabPanel>
                {useGithubSSO && (
                    <TabsTabPanel value={value} index={3}>
                        <GithubAccount {...props} />
                    </TabsTabPanel>
                )}
                {useTwoFactorAuth && (
                    <TabsTabPanel value={value} index={3 + (useGithubSSO ? 1 : 0)}>
                        <TwoFactor {...props} />
                    </TabsTabPanel>
                )}
                <TabsTabPanel
                    value={value}
                    index={3 + (useGithubSSO ? 1 : 0) + (useTwoFactorAuth ? 1 : 0)}
                >
                    <APIToken {...props} />
                </TabsTabPanel>
                <TabsTabPanel
                    value={value}
                    index={4 + (useGithubSSO ? 1 : 0) + (useTwoFactorAuth ? 1 : 0)}
                >
                    <AccountDelete {...props} />
                </TabsTabPanel>
            </Box>
        </Box>
    );
};

export default ManageAccountPage;
