import { FC } from 'react';
import { Card, CardContent, CardHeader, IconButton, Tooltip } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() =>
    createStyles({
        title: {
            paddingBottom: 0,
        },
        button: {
            marginRight: '5px;',
        },
        card: {
            border: '1px solid #e1e4e8',
        },
    }),
);

type DashboardAccountSectionProps = {
    title: string;
    linkText: string;
    content: JSX.Element;
    action?: () => void;
};

const DashboardAccountSection: FC<DashboardAccountSectionProps> = (
    props: DashboardAccountSectionProps,
) => {
    const { title, linkText, action, content } = props;
    const classes = useStyles();

    return (
        <Card elevation={0} className={classes.card}>
            <CardHeader
                className={classes.title}
                action={
                    action === undefined ? undefined : (
                        <Tooltip title={linkText}>
                            <IconButton
                                className={classes.button}
                                onClick={action}
                                aria-label={linkText}
                                size="large"
                            >
                                <ArrowForwardIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                    )
                }
                title={title}
            />
            <CardContent>{content}</CardContent>
        </Card>
    );
};

export default DashboardAccountSection;
