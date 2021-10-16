import { FC, ReactNode } from 'react';
import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { snakeToTitleCase } from '../../../utils/TextUtils';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        field: {
            display: 'flex',
            border: '1px solid #e1e4e8',
        },
        fieldSide: {
            flex: '50%',
            padding: theme.spacing(1),
            fontWeight: 'bold',
            backgroundColor: '#f5f5f5',
            color: '#24292e',
        },
        left: {
            borderRight: '1px solid #e1e4e8',
        },
        right: {},
        empty: {
            color: '#999999',
        },
        diff: {
            border: '1px solid #e1e4e8',
            borderTop: 0,
        },
    }),
);

type FieldContainerProps = {
    field: string;
    leftEmpty: boolean;
    rightEmpty: boolean;
    children?: ReactNode;
};

const FieldContainer: FC<FieldContainerProps> = (props: FieldContainerProps) => {
    const classes = useStyles();
    const { field, children, leftEmpty, rightEmpty } = props;

    const fieldFormatted = snakeToTitleCase(field);
    return (
        <div className={classes.root}>
            <div className={classes.field}>
                <div
                    className={clsx(classes.fieldSide, classes.left, {
                        [classes.empty]: leftEmpty,
                    })}
                >
                    {fieldFormatted}:
                </div>
                <div
                    className={clsx(classes.fieldSide, classes.right, {
                        [classes.empty]: rightEmpty,
                    })}
                >
                    {fieldFormatted}:
                </div>
            </div>
            <div className={classes.diff}>{children}</div>
        </div>
    );
};

export default FieldContainer;
