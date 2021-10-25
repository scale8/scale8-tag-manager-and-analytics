import { FC, ReactNode, useState } from 'react';
import clsx from 'clsx';
import { Box, Collapse, lighten } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DiffMap } from '../../../types/DiffTypes';
import ItemLabel from './ItemLabel';

type ObjectDiffContainerProps = {
    mode?: 'unchanged' | 'added' | 'removed';
    objKey: string;
    diffMap?: DiffMap;
    children?: ReactNode;
};

const ObjectDiffContainer: FC<ObjectDiffContainerProps> = (props: ObjectDiffContainerProps) => {
    const [open, setOpen] = useState(false);

    const { objKey, diffMap, mode, children } = props;

    return (
        <Box
            sx={{
                borderRadius: '4px',
                border: '1px solid #e1e4e8',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    borderBottom: '1px solid #e1e4e8',
                    color: '#24292e',
                    borderRadius: '4px 4px 0 0',
                    '&.closed': {
                        borderRadius: '4px',
                        borderBottom: 0,
                    },
                    '&.removed::before': {
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'column',
                        textAlign: 'center',
                        width: '35px',
                        flexShrink: 0,
                        content: '"—"',
                        backgroundColor: (theme) => lighten(theme.palette.error.main, 0.9),
                        color: (theme) => theme.palette.error.main,
                    },
                    '&.added::before': {
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'column',
                        textAlign: 'center',
                        width: '35px',
                        flexShrink: 0,
                        content: '"＋"',
                        backgroundColor: (theme) => lighten(theme.palette.success.main, 0.9),
                        color: (theme) => theme.palette.success.main,
                        fontWeight: 'bold',
                    },
                }}
                className={clsx({
                    closed: !open,
                    added: mode === 'added',
                    removed: mode === 'removed',
                })}
                onClick={() => {
                    setOpen((prev) => !prev);
                }}
            >
                <Box
                    sx={{
                        padding: 1,
                        flexGrow: 1,
                        wordBreak: 'break-word',
                        '& small': {
                            color: '#666666',
                        },
                    }}
                >
                    <ItemLabel diffMap={diffMap} objKey={objKey} />
                </Box>
                <Box p={1}>
                    <Box
                        sx={{
                            width: '20px',
                            height: '20px',
                            transform: 'rotate(0deg)',
                            transition: (theme) =>
                                theme.transitions.create('transform', {
                                    duration: theme.transitions.duration.shortest,
                                }),
                            '&.expanded': {
                                transform: 'rotate(180deg)',
                            },
                        }}
                        className={open ? 'expanded' : undefined}
                    >
                        <ExpandMoreIcon height={20} width={20} />
                    </Box>
                </Box>
            </Box>
            <Collapse in={open}>
                <Box
                    sx={{
                        padding: (theme) => theme.spacing(1, 1, 0),
                    }}
                >
                    {children}
                </Box>
            </Collapse>
        </Box>
    );
};

export default ObjectDiffContainer;
