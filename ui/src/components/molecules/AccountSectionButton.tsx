import { FC } from 'react';
import { Box, Button, darken, Tooltip } from '@mui/material';
import { grey } from '@mui/material/colors';

type AccountSectionButtonProps = {
    isTag: boolean;
    isOwner: boolean;
    tooltip: string;
    text: string;
    clickAction: () => void;
};

export const AccountSectionButton: FC<AccountSectionButtonProps> = (
    props: AccountSectionButtonProps,
) => {
    const { isTag, isOwner, clickAction, text, tooltip } = props;

    return (
        <Box pt={1}>
            <Tooltip title={tooltip}>
                <span>
                    <Button
                        variant="contained"
                        onClick={clickAction}
                        sx={
                            isOwner
                                ? {
                                      color: '#ffffff',
                                      backgroundColor: (theme) =>
                                          isTag
                                              ? theme.palette.tagManagerColor.main
                                              : theme.palette.dataManagerColor.main,
                                      '&:hover': {
                                          backgroundColor: (theme) =>
                                              isTag
                                                  ? darken(theme.palette.tagManagerColor.main, 0.2)
                                                  : darken(
                                                        theme.palette.dataManagerColor.main,
                                                        0.2,
                                                    ),
                                      },
                                  }
                                : {
                                      color: '#ffffff',
                                      backgroundColor: grey[400],
                                      '&:hover': {
                                          backgroundColor: grey[400],
                                      },
                                  }
                        }
                        disabled={!isOwner}
                        color="inherit"
                        disableElevation
                    >
                        {text}
                    </Button>
                </span>
            </Tooltip>
        </Box>
    );
};
