import { FC, ReactNode } from 'react';
import {
    Box,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
} from '@mui/material';
import { SectionAction, SectionActionsSpeedDial } from './SectionActionsSpeedDial';
import AppliedIcon from '../atoms/Icons/AppliedIcon';
import Link from '../atoms/Next/Link';

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
    return (
        <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', marginBottom: 2 }}>
            <Box
                component="ul"
                sx={{
                    margin: 0,
                    padding: 0,
                    position: 'relative',
                    listStyle: 'none',
                    background: props.highlight ? '#f5f5f5' : undefined,
                }}
            >
                <ListItem>
                    <>
                        {props.applied !== undefined && (
                            <ListItemIcon
                                sx={{
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
            </Box>
            <Divider />
            <Box p={2} sx={{ background: props.highlight ? '#f5f5f5' : undefined }}>
                {props.children}
            </Box>
        </Box>
    );
};

export { InnerTagElementContainer };
