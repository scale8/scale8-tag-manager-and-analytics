import { FC, ReactNode } from 'react';
import PageTitle, { PageTitleProps } from '../molecules/PageTitle';
import { Box } from '@mui/material';

const NonTablePageContainer: FC<PageTitleProps> = (
    props: PageTitleProps & { children?: ReactNode },
) => {
    const { children, ...titleProps } = props;

    return (
        <Box sx={{ padding: (theme) => theme.spacing(0, 2, 4, 2) }}>
            <PageTitle {...titleProps} />
            <div>{children}</div>
        </Box>
    );
};

export default NonTablePageContainer;
