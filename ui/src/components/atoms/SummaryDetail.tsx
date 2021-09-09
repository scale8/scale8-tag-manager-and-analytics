import { FC } from 'react';
import { Box } from '@material-ui/core';

export type SummaryDetailProps = {
    title: string;
    value: string;
    percentage?: number;
    trend?: 'u' | 'd';
    outcome?: 'p' | 'n';
};

const SummaryDetail: FC<SummaryDetailProps> = (props: SummaryDetailProps) => {
    const { title, value, percentage, outcome, trend } = props;

    const noValue = value === '0' || value === '0%' || value === '00s';

    return (
        <Box mr={10}>
            <Box color="#9e9e9e">{title}</Box>
            <Box display="flex" alignItems="center">
                <Box fontSize="2rem" lineHeight="3rem">
                    {noValue ? '-' : value}
                </Box>
                {!noValue &&
                    percentage !== undefined &&
                    outcome !== undefined &&
                    trend !== undefined && (
                        <Box color={outcome === 'p' ? '#01c8a1' : '#c63d51'} ml={1}>
                            {trend === 'u' ? '↑' : '↓'} {percentage}%
                        </Box>
                    )}
                {!noValue &&
                    percentage !== undefined &&
                    (outcome === undefined || trend === undefined) && (
                        <Box ml={1}>{percentage}%</Box>
                    )}
            </Box>
        </Box>
    );
};

export default SummaryDetail;
