import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LoggedOutNavigationContainer from '../../atoms/LoggedOutNavigationContainer';
import { ChildrenOnlyProps } from '../../../types/props/ChildrenOnlyProps';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        minWidth: '320px',
        background: '#f9f9f9',
        position: 'relative',
    },
    section: {
        flexShrink: 0,
        width: '100%',
    },
}));

const LoggedOutTemplate: FC<ChildrenOnlyProps> = (props: ChildrenOnlyProps) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.section}>
                <LoggedOutNavigationContainer />
            </div>
            <div className={classes.section}>{props.children}</div>
        </div>
    );
};

export default LoggedOutTemplate;
