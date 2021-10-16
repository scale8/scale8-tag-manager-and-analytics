import { FC, ReactNode } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {
    Divider,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
} from '@mui/material';
import { SectionAction, SectionActionsSpeedDial } from './SectionActionsSpeedDial';
import AppliedIcon from '../atoms/Icons/AppliedIcon';
import Link from '../atoms/Next/Link';

const useStyles = makeStyles((theme) => ({
    root: {
        border: '1px solid rgba(0, 0, 0, 0.12)',
        marginBottom: theme.spacing(2),
    },
    containerHeader: {
        margin: 0,
        padding: 0,
        position: 'relative',
        listStyle: 'none',
    },
    content: {
        padding: theme.spacing(2),
    },
}));

type InnerTagElementContainerProps = {
    children: ReactNode;
    title: string;
    link?: { text: string; href: string };
    id: string;
    actions: SectionAction[];
    readonly?: boolean;
    applied?: boolean;
    ruleGroupCompleted?: boolean;
    appliedVerb?: string;
    highlight?: boolean;
};

const InnerTagElementContainer: FC<InnerTagElementContainerProps> = (
    props: InnerTagElementContainerProps,
) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <ul
                className={classes.containerHeader}
                style={props.highlight ? { background: '#f5f5f5' } : {}}
            >
                <ListItem>
                    <>
                        {props.applied !== undefined && (
                            <ListItemIcon
                                style={{
                                    minWidth: '10px',
                                    paddingRight: '10px',
                                }}
                            >
                                <AppliedIcon
                                    applied={props.applied}
                                    verb={
                                        props.appliedVerb === undefined
                                            ? 'Applied'
                                            : props.appliedVerb
                                    }
                                    ruleGroupCompleted={!!props.ruleGroupCompleted}
                                />
                            </ListItemIcon>
                        )}
                        <ListItemText>
                            {props.title}
                            {props.link !== undefined && (
                                <Link href={props.link.href}>{props.link.text}</Link>
                            )}
                        </ListItemText>
                        <ListItemSecondaryAction>
                            <SectionActionsSpeedDial
                                actions={props.actions}
                                id={props.id}
                                hide={props.readonly}
                            />
                        </ListItemSecondaryAction>
                    </>
                </ListItem>
            </ul>
            <Divider />
            <div
                className={classes.content}
                style={props.highlight ? { background: '#f5f5f5' } : {}}
            >
                {props.children}
            </div>
        </div>
    );
};

export { InnerTagElementContainer };
