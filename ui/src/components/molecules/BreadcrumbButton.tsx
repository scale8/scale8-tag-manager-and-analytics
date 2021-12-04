import { FC, MouseEvent, useState } from 'react';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BreadcrumbAction, BreadcrumbButtonProps } from '../../utils/BreadcrumbButtonsUtils';

const BreadcrumbButton: FC<BreadcrumbButtonProps> = (props: BreadcrumbButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const closeAndExecuteAction = (action: () => void) => {
        setAnchorEl(null);
        action();
    };

    return (
        <>
            <Button
                color="inherit"
                sx={{
                    marginTop: '-20px',
                    padding: '0 0 0 5px',
                    color: 'inherit',
                    textTransform: 'none',
                    minWidth: 25,
                    height: '50px',
                    fontWeight: 500,
                    '&.Mui-disabled': {
                        color: 'inherit',
                    },
                }}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => props.jump.action()}
                disabled={props.isCurrentPage}
            >
                <Box flexDirection="column" textAlign="left">
                    <Box display="flex" alignItems="center" color="inherit" height="20px" mr="5px">
                        {props.elementIcon && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                    marginRight: '5px',
                                    height: '20px',
                                }}
                            >
                                <props.elementIcon sx={{ fontSize: '1rem' }} />
                            </Box>
                        )}
                        <Box
                            component="span"
                            sx={{
                                fontSize: '0.75rem',
                                lineHeight: '12px',
                                marginTop: '2px',
                            }}
                        >
                            {props.elementText}
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" height="30px">
                        {props.icon && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                    marginRight: '5px',
                                    height: '30px',
                                }}
                            >
                                <props.icon sx={{ fontSize: '1rem' }} />
                            </Box>
                        )}
                        <Box mr="5px" fontSize="1.125rem">
                            {props.text}
                        </Box>
                    </Box>
                </Box>
            </Button>
            {props.list.length > 0 && (
                <>
                    <Button
                        color="inherit"
                        sx={{
                            marginTop: '-20px',
                            height: '50px',
                            padding: '20px 0 0 0',
                            color: 'inherit',
                            textTransform: 'none',
                            minWidth: '24px',
                            fontWeight: 500,
                        }}
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <Box display="inline-flex" alignItems="center">
                            <ExpandMoreIcon />
                        </Box>
                    </Button>
                    <Menu
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem disabled>
                            <Box fontSize={12} minWidth={200}>
                                <Typography variant="inherit" noWrap>
                                    {props.changeText}
                                </Typography>
                            </Box>
                        </MenuItem>
                        {props.list.map((item: BreadcrumbAction, index: number) => (
                            <MenuItem
                                key={index}
                                onClick={() => closeAndExecuteAction(item.action)}
                            >
                                {item.icon && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            overflow: 'hidden',
                                            marginRight: '5px',
                                            height: '20px',
                                        }}
                                    >
                                        <item.icon sx={{ fontSize: '1rem' }} />
                                    </Box>
                                )}
                                {item.text}
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            )}
        </>
    );
};

export default BreadcrumbButton;
