import { FC, ReactNode } from 'react';
import { Box } from '@mui/material';

type TabPanelProps = {
    children?: ReactNode;
    index: any;
    value: any;
    fullHeight?: boolean;
};

const TabsTabPanel: FC<TabPanelProps> = (props: TabPanelProps) => {
    const { children, value, index, fullHeight, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            sx={fullHeight ? { height: '100%' } : { maxHeight: '100%', overflow: 'auto' }}
            {...other}
        >
            {value === index && children}
        </Box>
    );
};

export default TabsTabPanel;
