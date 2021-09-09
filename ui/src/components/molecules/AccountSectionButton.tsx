import { FC } from 'react';
import { Box, Button, Tooltip } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

type AccountSectionButtonProps = {
    isTag: boolean;
    isOwner: boolean;
    tooltip: string;
    text: string;
    clickAction: () => void;
};

const AccountSectionButton: FC<AccountSectionButtonProps> = (props: AccountSectionButtonProps) => {
    const { isTag, isOwner, clickAction, text, tooltip } = props;
    const theme = useTheme();

    return (
        <Box textAlign="center" pt={1}>
            <Tooltip title={tooltip}>
                <span>
                    <Button
                        variant="contained"
                        onClick={clickAction}
                        style={
                            isOwner
                                ? {
                                      color: '#ffffff',
                                      backgroundColor: isTag
                                          ? theme.palette.tagManagerColor.main
                                          : theme.palette.dataManagerColor.main,
                                      width: '100%',
                                  }
                                : {
                                      color: '#ffffff',
                                      backgroundColor: grey[400],
                                      width: '100%',
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
export { AccountSectionButton };
