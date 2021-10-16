import { FC, ReactNode } from 'react';
import { Box } from '@mui/material';
import JSONTree from 'react-json-tree';

export type TabularDataSource = [string, string | Record<string, any>][];

export type TabularDataProps = {
    title?: ReactNode;
    source: TabularDataSource;
    noBorder?: boolean;
};

const tabularDataBorder = '1px solid #e0e0e0;';

const TabularData: FC<TabularDataProps> = (props: TabularDataProps) => {
    const { title, source, noBorder } = props;

    const theme = {
        scheme: 'google',
        author: 'seth wright (http://sethawright.com)',
        base00: '#1d1f21',
        base01: '#282a2e',
        base02: '#373b41',
        base03: '#969896',
        base04: '#b4b7b4',
        base05: '#c5c8c6',
        base06: '#e0e0e0',
        base07: '#ffffff',
        base08: '#CC342B',
        base09: '#F96A38',
        base0A: '#FBA922',
        base0B: '#198844',
        base0C: '#3971ED',
        base0D: '#3971ED',
        base0E: '#A36AC7',
        base0F: '#3971ED',
    };

    return (
        <>
            {title && (
                <Box px={1} py={2}>
                    {title}
                </Box>
            )}
            <Box
                borderTop={noBorder ? undefined : tabularDataBorder}
                borderBottom={noBorder ? undefined : tabularDataBorder}
            >
                {source.map((_, k) => {
                    const [key, value] = _;

                    return (
                        <Box
                            key={k}
                            width="100%"
                            display="flex"
                            borderBottom={source.length - 1 === k ? undefined : tabularDataBorder}
                        >
                            <Box width={150} p={1} display="flex" alignItems="center">
                                <b>{key}</b>
                            </Box>
                            <Box p={1}>
                                {typeof value === 'string' ? (
                                    value
                                ) : (
                                    <JSONTree
                                        data={value}
                                        theme={theme}
                                        hideRoot={true}
                                        invertTheme={true}
                                    />
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </>
    );
};

export { TabularData };
