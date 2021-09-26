import { FC } from 'react';
import ChartPageContent, { ChartPageContentProps } from './ChartPageContent';
import { AppErrorsSummary } from '../../../lazyComponents/AppErrorsSummary';
import { AppErrorsChart } from '../../../lazyComponents/AppErrorsChart';
import { AppErrorsCountries } from '../../../lazyComponents/lists/AppErrorsCountries';
import { AppErrorsDevices } from '../../../lazyComponents/lists/AppErrorsDevices';
import { AppErrorContentProps } from '../../../types/props/AppErrorContentProps';
import { AppErrorsList } from '../../../lazyComponents/lists/AppErrorsList';

const AppErrorsPageContent: FC<AppErrorContentProps> = (props: AppErrorContentProps) => {
    const chartPageContentProps: ChartPageContentProps = {
        summaryBlock: <AppErrorsSummary {...props} />,
        chartBlock: <AppErrorsChart {...props} />,
        listsBlock: [<AppErrorsCountries {...props} />, <AppErrorsDevices {...props} />],
        bigListBlock: <AppErrorsList {...props} />,
    };

    return <ChartPageContent {...chartPageContentProps} />;
};

export default AppErrorsPageContent;
