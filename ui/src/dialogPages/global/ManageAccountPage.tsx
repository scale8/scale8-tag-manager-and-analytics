import { ChangeEvent, FC, useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import { Box } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import { PersonalInfoUpdate } from './PersonalInfoUpdate';
import { ChangePassword } from './ChangePassword';
import { GithubAccount } from './GithubAccount';
import { TwoFactor } from './TwoFactor';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { APIToken } from './APIToken';
import { DialogPageProps } from '../../types/DialogTypes';
import TabsTabPanel from '../../components/molecules/TabsTabPanel';
import { AccountDelete } from './AccountDelete';
import { ChangeEmail } from './ChangeEmail';
import { useConfigState } from '../../context/AppContext';

const useStyles = makeStyles({
    tabRoot: { minHeight: 35 },
    wrapper: { alignItems: 'flex-start', whiteSpace: 'nowrap' },
});

const ManageAccountPage: FC<DialogPageProps> = (props: DialogPageProps) => {
    const [value, setValue] = useState(0);
    const { useGithubSSO, useTwoFactorAuth } = useConfigState();
    const theme = useTheme();
    const classes = useStyles();

    const handleChange = (event: ChangeEvent<unknown>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box minWidth={560} maxWidth={560} minHeight={320} display="flex">
            <Tabs
                style={{
                    paddingTop: '5px',
                    borderRight: `1px solid ${theme.palette.divider}`,
                }}
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                orientation="vertical"
            >
                <Tab
                    label="Personal info"
                    classes={{
                        wrapper: classes.wrapper,
                        root: classes.tabRoot,
                    }}
                    wrapped
                />
                <Tab
                    label="Change Password"
                    classes={{
                        wrapper: classes.wrapper,
                        root: classes.tabRoot,
                    }}
                    wrapped
                />
                <Tab
                    label="Change Email"
                    classes={{
                        wrapper: classes.wrapper,
                        root: classes.tabRoot,
                    }}
                    wrapped
                />
                {useGithubSSO && (
                    <Tab
                        label="GitHub Account"
                        classes={{
                            wrapper: classes.wrapper,
                            root: classes.tabRoot,
                        }}
                        wrapped
                    />
                )}
                {useTwoFactorAuth && (
                    <Tab
                        label="2-Factor Auth"
                        classes={{
                            wrapper: classes.wrapper,
                            root: classes.tabRoot,
                        }}
                        wrapped
                    />
                )}
                <Tab
                    label="API Token"
                    classes={{
                        wrapper: classes.wrapper,
                        root: classes.tabRoot,
                    }}
                    wrapped
                />
                <Tab
                    label="Delete Account"
                    classes={{
                        wrapper: classes.wrapper,
                        root: classes.tabRoot,
                    }}
                    wrapped
                />
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
