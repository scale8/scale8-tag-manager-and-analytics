import { FC, ReactNode } from 'react';
import clsx from 'clsx';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderRadius: '4px',
            border: '1px solid #e1e4e8',
        },
        content: {
            padding: theme.spacing(1, 1, 0),
        },
        objectTitle: {
            display: 'flex',
            fontSize: '1.1em',
            borderBottom: '1px solid #e1e4e8',
        },
        objectTitleSide: {
            flex: '50%',
            padding: theme.spacing(1),
            backgroundColor: '#ffffff',
            wordBreak: 'break-word',
            '& small': {
                color: '#666666',
            },
        },
        left: {
            borderRadius: '4px 0 0 0',
            borderRight: '1px solid #e1e4e8',
        },
        right: {
            borderRadius: '0 4px 0 0',
        },
    }),
);

type MainDiffContainerProps = {
    prefix?: string;
    leftName?: string;
    rightName?: string;
    leftId: string;
    rightId: string;
    children?: ReactNode;
};

const MainDiffContainer: FC<MainDiffContainerProps> = (props: MainDiffContainerProps) => {
    const classes = useStyles();

    const { prefix, leftName, rightName, leftId, rightId, children } = props;

    return (
        <div className={classes.root}>
            <div className={classes.objectTitle}>
                <div className={clsx(classes.objectTitleSide, classes.left)}>
                    {prefix && <span>{prefix} </span>}
                    {leftName ? (
                        <span>
                            {leftName} <small>({leftId})</small>
                        </span>
                    ) : (
                        <span>{leftId}</span>
                    )}
                </div>
                <div className={clsx(classes.objectTitleSide, classes.right)}>
                    {prefix && <span>{prefix} </span>}
                    {rightName ? (
                        <span>
                            {rightName} <small>({rightId})</small>
                        </span>
                    ) : (
                        <span>{rightId}</span>
                    )}
                </div>
            </div>
            <div className={classes.content}>{children}</div>
        </div>
    );
};

export default MainDiffContainer;
