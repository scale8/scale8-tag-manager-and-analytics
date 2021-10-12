import { FC } from 'react';
import ChartPageContent, { ChartPageContentProps } from './ChartPageContent';
import { AppErrorsSummary } from '../../../lazyComponents/AppErrorsSummary';
import { AppErrorsChart } from '../../../lazyComponents/AppErrorsChart';
import { AppErrorsExtraLists } from '../../../lazyComponents/lists/AppErrorsExtraLists';
import { AppErrorContentProps } from '../../../types/props/AppErrorContentProps';
import { AppErrorsList } from '../../../lazyComponents/lists/AppErrorsList';
import { AppErrorDetails } from '../../../lazyComponents/AppErrorDetails';
import { AppDevicesLists } from '../../../lazyComponents/lists/AppDevicesLists';

const AppErrorsPageContent: FC<AppErrorContentProps> = (props: AppErrorContentProps) => {
    const errorFilterOn = props.appQueryOptions.filter_options.error_id !== undefined;
    const chartPageContentProps: ChartPageContentProps = {
        summaryBlock: <AppErrorsSummary {...props} />,
        chartBlock: <AppErrorsChart {...props} />,
        bigListBlock: errorFilterOn ? <AppErrorDetails {...props} /> : <AppErrorsList {...props} />,
        listsBlock: [
            <AppErrorsExtraLists {...props} />,
            <AppDevicesLists {...props} forErrors={true} />,
        ],
    };

    return <ChartPageContent {...chartPageContentProps} />;
};

export default AppErrorsPageContent;
