import { FC } from 'react';
import { Box } from '@mui/material';
import { AppErrorDetail } from '../../lazyComponents/AppErrorDetails';
import { AppErrorContentProps } from '../../types/props/AppErrorContentProps';
import { AnchorLinkIcon } from '../atoms/AnchorLinkIcon';
import Alert from '@mui/material/Alert';
import { AppErrorDetailsContainer } from '../molecules/AppErrorDetails/AppErrorDetailsContainer';
import { DetailBlock } from '../molecules/AppErrorDetails/DetailBlock';
import { TraceBox } from '../molecules/AppErrorDetails/TraceBox';
import { CodeBox } from '../molecules/AppErrorDetails/CodeBox';

export const AppErrorDetailsContent: FC<AppErrorContentProps & { list: AppErrorDetail[] }> = ({
    list,
    ...props
}) => {
    return (
        <AppErrorDetailsContainer
            removeFilter={() => {
                props.setFilter('error_id', undefined);
            }}
        >
            <Box width="100%">
                <Box display="flex">
                    <DetailBlock title="Message">
                        <Box display="flex" alignItems="center">
                            <Box marginTop="2px">{list[0].message}</Box>
                        </Box>
                    </DetailBlock>
                    <DetailBlock title="File">
                        <Box display="flex" alignItems="center">
                            <Box marginRight={1} marginTop="4px">
                                <AnchorLinkIcon href={list[0].file} />
                            </Box>
                            <Box marginTop="2px">{list[0].file}</Box>
                        </Box>
                    </DetailBlock>
                </Box>

                {list[0].error_trace === 'Undefined' ? (
                    <Alert severity="warning">Stack trace is not available for this error</Alert>
                ) : (
                    <TraceBox trace={list[0].error_trace} />
                )}
                <Box mt={2} />
                <CodeBox
                    fileUrl={list[0].file}
                    errorRow={parseInt(list[0].row)}
                    errorCol={parseInt(list[0].column)}
                />
                <Box mt={2} />
            </Box>
        </AppErrorDetailsContainer>
    );
};
