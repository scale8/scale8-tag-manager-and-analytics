import { FC, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    card: {
        marginBottom: theme.spacing(2),
        border: '1px solid #e1e4e8',
    },
    dark: {
        backgroundColor: '#f5f5f5',
    },
    section: { padding: theme.spacing(3, 2) },
}));

type AppSettingsContainerProps = {
    children: ReactNode;
    dark?: boolean;
};

const OrgSettingsContainer: FC<AppSettingsContainerProps> = (props: AppSettingsContainerProps) => {
    const classes = useStyles();

    return (
        <Card
            className={clsx(classes.card, {
                [classes.dark]: props.dark,
            })}
            elevation={0}
        >
            <div className={classes.section}>{props.children}</div>
        </Card>
    );
};

export { OrgSettingsContainer };
