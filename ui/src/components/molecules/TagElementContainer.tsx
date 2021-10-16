import { FC, ReactNode } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Card, CardContent, CardHeader } from '@mui/material';
import clsx from 'clsx';
import { SectionAction, SectionActionsSpeedDial } from './SectionActionsSpeedDial';
import AppliedIcon from '../atoms/Icons/AppliedIcon';

const useStyles = makeStyles((theme) => ({
    card: {
        marginBottom: theme.spacing(2),
        border: '1px solid #e1e4e8',
    },
    cardHeader: {
        padding: theme.spacing(1, 2, 1, 2),
    },
    title: {
        fontSize: '18px',
    },
    dark: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    section: { padding: theme.spacing(0, 2) },
    avatar: {
        paddingTop: '7px',
        marginRight: '10px',
    },
}));

type TagElementContainerProps = {
    children: ReactNode;
    title: string;
    id: string;
    actions: SectionAction[];
    readonly?: boolean;
    dark?: boolean;
    applied?: boolean;
    ruleGroupCompleted?: boolean;
    noHeader?: boolean;
};

const TagElementContainer: FC<TagElementContainerProps> = (props: TagElementContainerProps) => {
    const classes = useStyles();

    return (
        <Card
            className={clsx(classes.card, {
                [classes.dark]: props.dark,
            })}
            elevation={0}
        >
            {!props.noHeader && (
                <CardHeader
                    classes={{
                        title: classes.title,
                        avatar: classes.avatar,
                    }}
                    className={classes.cardHeader}
                    avatar={
                        props.applied === undefined ? undefined : (
                            <AppliedIcon
                                applied={props.applied}
                                verb="Applied"
                                ruleGroupCompleted={!!props.ruleGroupCompleted}
                            />
                        )
                    }
                    action={
                        <>
                            {
                                <SectionActionsSpeedDial
                                    actions={props.actions}
                                    id={props.id}
                                    hide={props.readonly}
                                />
                            }
                        </>
                    }
                    title={props.title}
                />
            )}
            <CardContent className={classes.section}>{props.children}</CardContent>
        </Card>
    );
};

export { TagElementContainer };
