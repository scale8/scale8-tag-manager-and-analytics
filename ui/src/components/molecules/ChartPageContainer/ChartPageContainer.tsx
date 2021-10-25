import { FC, ReactNode } from 'react';
import { AppQueryFilterOptions } from '../../../gql/generated/globalTypes';
import { Box } from '@mui/material';

export type ChartPageContainerProps = {
    leftHeaderBlock: ReactNode;
    rightHeaderBlock: ReactNode;
    secondaryBlock: ReactNode;
};

export const extractFilters = (filter_options: AppQueryFilterOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { from, to, event, event_group, ...filters } = {
        ...filter_options,
    };
    return filters;
};

const ChartPageContainer: FC<ChartPageContainerProps & { children: ReactNode }> = (
    props: ChartPageContainerProps & { children: ReactNode },
) => {
    const { children, leftHeaderBlock, rightHeaderBlock, secondaryBlock } = props;

    return (
        <Box sx={{ padding: (theme) => theme.spacing(0, 2) }}>
            <Box sx={{ padding: '20px 0 12px 0', display: 'flex', alignItems: 'top' }}>
                <Box sx={{ flexGrow: 1 }}>{leftHeaderBlock}</Box>
                <Box sx={{ paddingBottom: (theme) => theme.spacing(1) }}>{rightHeaderBlock}</Box>
            </Box>
            <Box sx={{ width: '100%', paddingBottom: '12px' }}>{secondaryBlock}</Box>
            <Box>{children}</Box>
        </Box>
    );
};

export default ChartPageContainer;
