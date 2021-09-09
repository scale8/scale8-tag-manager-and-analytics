import { FC } from 'react';
import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        textAlign: 'center',
        margin: theme.spacing(5, 3),
    },
    text: {
        backgroundColor: 'white',
        position: 'absolute',
        padding: '0 5px',
        marginTop: '-10px',
        display: 'inline-block',
        textTransform: 'uppercase',
        fontSize: '15px',
        color: '#888888',
    },
    dark: {
        backgroundColor: '#f5f5f5',
    },
}));

type RuleContainerDividerProps = {
    text: string;
    dark?: boolean;
};

const RuleContainerDivider: FC<RuleContainerDividerProps> = (props: RuleContainerDividerProps) => {
    const classes = useStyles();

    const { text } = props;

    return (
        <div className={classes.root}>
            <Divider />
            <div
                className={clsx(classes.text, {
                    [classes.dark]: props.dark,
                })}
            >
                {text}
            </div>
        </div>
    );
};

export default RuleContainerDivider;
