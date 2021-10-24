import { FC, ReactNode } from 'react';
import { Box, Drawer } from '@mui/material';
import { DialogBaseProps } from '../../types/DialogTypes';

type MainDrawerProps = DialogBaseProps & {
    children: ReactNode;
};

const MainDrawer: FC<MainDrawerProps> = (props: MainDrawerProps) => {
    const mainSectionWidth = props.width ? props.width : 432;

    const secondaryOpen = props.secondaryPageComponent !== undefined;

    return (
        <Drawer sx={{ flexShrink: 0 }} anchor="right" open={props.open}>
            <Box
                display="flex"
                width={mainSectionWidth + (secondaryOpen ? 432 : 0)}
                sx={{ transition: 'width 0.2s', overflowX: 'hidden' }}
            >
                <Box flexShrink={0} width={mainSectionWidth} minHeight="100vh">
                    {props.children}
                </Box>
                {props.secondaryPageComponent !== undefined && (
                    <Box flexShrink={0} width={432} height="100vh" borderLeft="1px solid #dadada">
                        <props.secondaryPageComponent />
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export { MainDrawer };
