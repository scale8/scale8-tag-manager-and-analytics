import { FC } from 'react';
import Typography from '@mui/material/Typography';
import { InfoButton, InfoProps } from './InfoButton';
import { Box } from '@mui/material';

export type PageTitleProps = InfoProps & {
    title: string;
};

const PageTitle: FC<PageTitleProps> = (props: PageTitleProps) => {
    const { title, ...infoProps } = props;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                minHeight: (theme) => theme.spacing(8),
            }}
        >
            <Typography variant="h6" id="tableTitle" component="div">
                {title} <InfoButton {...infoProps} />
            </Typography>
        </Box>
    );
};

export default PageTitle;
