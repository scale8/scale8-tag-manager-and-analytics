import { ChangeEvent, FC, useState } from 'react';
import { Box, Card, Divider } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabsTabPanel from '../molecules/TabsTabPanel';
import {
    AppDashboardList,
    DashboardListProps,
} from '../../lazyComponents/abstractions/AppDashboardList';

type DashboardSectionTab = {
    title: string;
    listProps: DashboardListProps;
};

type DashboardListSectionProps = {
    tabs: DashboardSectionTab[];
};

const DashboardListSection: FC<DashboardListSectionProps> = (props: DashboardListSectionProps) => {
    const { tabs } = props;

    const [value, setValue] = useState(0);

    const handleChange = (event: ChangeEvent<unknown>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '4px',
            }}
            elevation={0}
        >
            <Box bgcolor="#f5f5f5;" width="100%" height="48px">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    sx={{
                        '& .MuiTabs-indicator': {
                            display: tabs.length > 1 ? undefined : 'none',
                        },
                    }}
                >
                    {tabs.map((tab) => (
                        <Tab
                            disableRipple
                            key={tab.title}
                            sx={{ minWidth: '50px' }}
                            label={tab.title}
                            wrapped
                        />
                    ))}
                </Tabs>
            </Box>
            <Divider />

            {tabs.map((tab, i) => (
                <TabsTabPanel key={i} value={value} index={i}>
                    <Box p={3} pb={1} height={400} overflow="auto">
                        {value === i && <AppDashboardList {...tab.listProps} />}
                    </Box>
                </TabsTabPanel>
            ))}
        </Card>
    );
};

export default DashboardListSection;
