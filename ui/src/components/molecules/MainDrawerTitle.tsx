import { FC, ReactNode } from 'react';
import { Box, Divider, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

type MainDrawerTitleProps = {
    children: ReactNode;
    handleDialogClose: (checkChanges: boolean) => void;
};

const MainDrawerTitle: FC<MainDrawerTitleProps> = (props: MainDrawerTitleProps) => {
    return (
        <>
            <Box display="flex" alignItems="center">
                <Box ml={1}>
                    <IconButton onClick={() => props.handleDialogClose(true)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box ml={1} flexGrow={1} fontSize="h6.fontSize" display="flex">
                    {props.children}
                </Box>
            </Box>
            <Divider />
        </>
    );
};

export { MainDrawerTitle };
