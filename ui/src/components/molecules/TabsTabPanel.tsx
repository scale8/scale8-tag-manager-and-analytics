import { FC, ReactNode } from 'react';

type TabPanelProps = {
    children?: ReactNode;
    index: any;
    value: any;
    fullHeight?: boolean;
};

const TabsTabPanel: FC<TabPanelProps> = (props: TabPanelProps) => {
    const { children, value, index, fullHeight, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            style={fullHeight ? { height: '100%' } : { maxHeight: '100%', overflow: 'auto' }}
            {...other}
        >
            {value === index && children}
        </div>
    );
};

export default TabsTabPanel;
