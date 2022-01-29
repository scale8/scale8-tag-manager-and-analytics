import { FC } from 'react';
import ChartPageContent, { ChartPageContentProps } from './ChartPageContent';
import { AppErrorsSummary } from '../../../lazyComponents/AppErrorsSummary';
import { AppErrorsChart } from '../../../lazyComponents/AppErrorsChart';
import { AppErrorsCountries } from '../../../lazyComponents/lists/AppErrorsCountries';
import { AppErrorsDevices } from '../../../lazyComponents/lists/AppErrorsDevices';
import { AppErrorContentProps } from '../../../types/props/AppErrorContentProps';
import { AppErrorsList } from '../../../lazyComponents/lists/AppErrorsList';
import { AppErrorDetails } from '../../../lazyComponents/AppErrorDetails';

const AppErrorsPageContent: FC<AppErrorContentProps> = (props: AppErrorContentProps) => {
    const errorFilterOn = props.appQueryOptions.filter_options.error_id !== undefined;
    const chartPageContentProps: ChartPageContentProps = {
        summaryBlock: <AppErrorsSummary {...props} />,
        chartBlock: <AppErrorsChart {...props} />,
        bigListBlock: errorFilterOn ? <AppErrorDetails {...props} /> : <AppErrorsList {...props} />,
        listsBlock: [
            <AppErrorsCountries key="AppErrorsCountries" {...props} />,
            <AppErrorsDevices key="AppErrorsDevices" {...props} />,
        ],
    };

    return <ChartPageContent {...chartPageContentProps} />;
};

export default AppErrorsPageContent;
