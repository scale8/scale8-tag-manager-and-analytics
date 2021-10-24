import { FC } from 'react';
import { Card, CardContent, CardHeader, IconButton, Tooltip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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

    return (
        <Card elevation={0} sx={{ border: '1px solid #e1e4e8' }}>
            <CardHeader
                sx={{ paddingBottom: 0 }}
                action={
                    action === undefined ? undefined : (
                        <Tooltip title={linkText}>
                            <IconButton
                                sx={{ marginRight: '5px;' }}
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
