import { FC, ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import { SectionAction, SectionActionsSpeedDial } from './SectionActionsSpeedDial';
import AppliedIcon from '../atoms/Icons/AppliedIcon';

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
    return (
        <Card
            sx={{
                marginBottom: 2,
                border: '1px solid #e1e4e8',
                backgroundColor: props.dark ? 'rgba(0, 0, 0, 0.04)' : undefined,
            }}
            elevation={0}
        >
            {!props.noHeader && (
                <CardHeader
                    sx={{
                        padding: (theme) => theme.spacing(1, 2, 1, 2),
                        '& .MuiCardHeader-title': {
                            fontSize: '18px',
                        },
                        '& .MuiCardHeader-avatar': {
                            paddingTop: '7px',
                            marginRight: '10px',
                        },
                    }}
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
            <CardContent sx={{ padding: (theme) => theme.spacing(0, 2) }}>
                {props.children}
            </CardContent>
        </Card>
    );
};

export { TagElementContainer };
