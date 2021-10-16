import { FC, ReactNode, useState } from 'react';
import clsx from 'clsx';
import { Collapse, lighten, Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DiffMap } from '../../../types/DiffTypes';
import ItemLabel from './ItemLabel';

const useStyles = makeStyles((theme: Theme) => {
    const transition = {
        duration: theme.transitions.duration.shortest,
    };

    return createStyles({
        root: {
            borderRadius: '4px',
            border: '1px solid #e1e4e8',
        },
        content: {
            padding: theme.spacing(1, 1, 0),
        },
        closed: {},
        expanded: {},
        added: {},
        removed: {},
        changed: {},
        unchanged: {},
        objectTitle: {
            display: 'flex',
            flexGrow: 1,
            borderBottom: '1px solid #e1e4e8',
            color: '#24292e',
            borderRadius: '4px 4px 0 0',
            '&$closed': {
                borderRadius: '4px',
                borderBottom: 0,
            },
            '&$removed::before': {
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                width: '35px',
                flexShrink: 0,
                content: '"—"',
                backgroundColor: lighten(theme.palette.error.main, 0.9),
                color: theme.palette.error.main,
            },
            '&$added::before': {
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                width: '35px',
                flexShrink: 0,
                content: '"＋"',
                backgroundColor: lighten(theme.palette.success.main, 0.9),
                color: theme.palette.success.main,
                fontWeight: 'bold',
            },
        },
        titleContainer: {
            padding: theme.spacing(1),
            flexGrow: 1,
            wordBreak: 'break-word',
            '& small': {
                color: '#666666',
            },
        },
        expandIconContainer: {
            padding: theme.spacing(1),
        },
        expandIcon: {
            width: '24px',
            height: '24px',
            transform: 'rotate(0deg)',
            transition: theme.transitions.create('transform', transition),
            '&$expanded': {
                transform: 'rotate(180deg)',
            },
        },
    });
});

type ObjectDiffContainerProps = {
    mode?: 'unchanged' | 'added' | 'removed';
    objKey: string;
    diffMap?: DiffMap;
    children?: ReactNode;
};

const ObjectDiffContainer: FC<ObjectDiffContainerProps> = (props: ObjectDiffContainerProps) => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const { objKey, diffMap, mode, children } = props;

    return (
        <div className={classes.root}>
            <div
                className={clsx(classes.objectTitle, {
                    [classes.closed]: !open,
                    [classes.added]: mode === 'added',
                    [classes.removed]: mode === 'removed',
                })}
                onClick={() => {
                    setOpen((prev) => !prev);
                }}
            >
                <div className={classes.titleContainer}>
                    <ItemLabel diffMap={diffMap} objKey={objKey} />
                </div>
                <div className={classes.expandIconContainer}>
                    <div
                        className={clsx(classes.expandIcon, {
                            [classes.expanded]: open,
                        })}
                    >
                        <ExpandMoreIcon />
                    </div>
                </div>
            </div>
            <Collapse in={open}>
                <div className={classes.content}>{children}</div>
            </Collapse>
        </div>
    );
};

export default ObjectDiffContainer;
