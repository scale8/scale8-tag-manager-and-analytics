import { FC, MouseEvent, useState } from 'react';
import { Box, IconButton, Popover } from '@mui/material';
import Markdown from 'markdown-to-jsx';
import HelpIcon from '@mui/icons-material/Help';
import { getInfo } from '../../info/getInfo';
import { navigationColorFromSectionLocator } from '../../containers/SectionsDetails';
import { standardMarkdownOptions } from '../../utils/MarkdownUtils';
import { getDocUrl } from '../../utils/ConfigUtils';
import { useLoggedInState } from '../../context/AppContext';

export type InfoProps = {
    side: 'left' | 'right';
    id: string;
};

const InfoButton: FC<InfoProps> = (props: InfoProps) => {
    const { templateInteractions } = useLoggedInState();
    const { sectionHistory } = templateInteractions;
    const navigationColor = navigationColorFromSectionLocator(sectionHistory.current);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (getInfo(props.id) === '') {
        return null;
    }

    return (
        <>
            <IconButton
                size="small"
                disableRipple
                sx={{
                    color: navigationColor,
                    background: 'transparent',
                }}
                onClick={handleClick}
            >
                <HelpIcon sx={{ fontSize: 15 }} />
            </IconButton>
            <Popover
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: props.side === 'right' ? 'right' : 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: props.side === 'right' ? 'left' : 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorEl={anchorEl}
            >
                <Box
                    sx={{
                        backgroundColor: '#f5f5f5',
                        width: '400px',
                        maxHeight: '300px',
                        overflow: 'auto',
                        padding: (theme) => theme.spacing(2, 2, 0),
                        '& p': {
                            margin: (theme) => theme.spacing(0, 0, 2, 0),
                            display: 'inline-block',
                        },
                        '& a': {
                            color: 'inherit',
                            textDecoration: 'underline',
                        },
                    }}
                >
                    <Markdown options={standardMarkdownOptions}>
                        {getInfo(props.id).replace('{{DOCUMENTATION_URL}}', getDocUrl())}
                    </Markdown>
                </Box>
            </Popover>
        </>
    );
};

export { InfoButton };
