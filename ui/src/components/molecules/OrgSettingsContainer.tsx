import { FC, ReactNode } from 'react';
import { Box, Card } from '@mui/material';

type AppSettingsContainerProps = {
    children: ReactNode;
    dark?: boolean;
};

const OrgSettingsContainer: FC<AppSettingsContainerProps> = (props: AppSettingsContainerProps) => {
    return (
        <Card
            sx={{
                marginBottom: 2,
                border: '1px solid #e1e4e8',
                backgroundColor: props.dark ? '#f5f5f5' : undefined,
            }}
            elevation={0}
        >
            <Box sx={{ padding: (theme) => theme.spacing(3, 2) }}>{props.children}</Box>
        </Card>
    );
};

export { OrgSettingsContainer };
