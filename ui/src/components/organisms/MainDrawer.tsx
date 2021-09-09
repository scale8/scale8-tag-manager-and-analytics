import { FC, ReactNode } from 'react';
import { Box, Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DialogBaseProps } from '../../types/DialogTypes';

const useStyles = makeStyles(() => ({
    root: {
        flexShrink: 0,
    },
    mainBox: {
        transition: 'width 0.2s',
        overflowX: 'hidden',
    },
}));

type MainDrawerProps = DialogBaseProps & {
    children: ReactNode;
};

const MainDrawer: FC<MainDrawerProps> = (props: MainDrawerProps) => {
    const classes = useStyles();

    const mainSectionWidth = props.width ? props.width : 432;

    const secondaryOpen = props.secondaryPageComponent !== undefined;

    return (
        <Drawer className={classes.root} anchor="right" open={props.open}>
            <Box
                display="flex"
                width={mainSectionWidth + (secondaryOpen ? 432 : 0)}
                className={classes.mainBox}
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
