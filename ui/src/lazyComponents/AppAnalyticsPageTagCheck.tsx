import { FC, useState } from 'react';
import { AppAnalyticsContentProps } from '../types/props/AppAnalyticsContentProps';
import { QueryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { useQuery } from '@apollo/client';
import AppAnalyticsContentQuery from '../gql/queries/AppAnalyticsContentQuery';
import { AppAnalyticsContentQueryData } from '../gql/generated/AppAnalyticsContentQueryData';
import AppAnalyticsPageContainer from '../components/molecules/ChartPageContainer/AppAnalyticsPageContainer';
import AppAnalyticsPageContent from '../components/molecules/ChartPageContent/AppAnalyticsPageContent';
import { Box, Paper } from '@mui/material';
import IconAlignedAlert from '../components/atoms/IconAlignedAlert';

import { TagManagerInstallInstructions } from './TagManagerInstallInstructions';

const AppAnalyticsPageTagCheckLoaded: FC<
    AppAnalyticsContentProps & { noData: boolean; environments: { id: string; name: string }[] }
> = (
    props: AppAnalyticsContentProps & {
        noData: boolean;
        environments: { id: string; name: string }[];
    },
) => {
    const { noData, environments, ...appAnalyticsContentProps } = props;

    const [checkTags, setCheckTags] = useState<boolean>(noData);

    return (
        <>
            {checkTags && (
                <Box
                    position="absolute"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    py={2}
                    zIndex={2}
                >
                    <Paper
                        elevation={5}
                        sx={{
                            width: 500,
                            background: 'white',
                            padding: 2,
                        }}
                    >
                        <IconAlignedAlert severity="warning">
                            It looks like there is no data available for the last 24 hours, are your
                            tags correctly installed?
                        </IconAlignedAlert>
                        <Box mb={2} />
                        <TagManagerInstallInstructions
                            environments={environments}
                            onConfirm={() => {
                                setCheckTags(false);
                            }}
                            text="I have installed my Tags"
                        />
                    </Paper>
                </Box>
            )}
            <Box
                sx={
                    checkTags
                        ? {
                              filter: 'blur(4px)',
                              height: '100%',
                              overflow: 'hidden',
                          }
                        : {}
                }
            >
                <AppAnalyticsPageContainer {...appAnalyticsContentProps}>
                    <AppAnalyticsPageContent {...appAnalyticsContentProps} />
                </AppAnalyticsPageContainer>
            </Box>
        </>
    );
};

const AppAnalyticsPageTagCheck: FC<AppAnalyticsContentProps> = (
    props: AppAnalyticsContentProps,
) => {
    const { id } = props;

    return QueryLoaderAndError<AppAnalyticsContentQueryData>(
        false,
        useQuery<AppAnalyticsContentQueryData>(AppAnalyticsContentQuery, {
            variables: {
                id,
            },
        }),
        (queryData: AppAnalyticsContentQueryData) => {
            const noData = queryData.getApp.event_request_stats.result.length === 0;
            const environments = queryData.getApp.environments;

            return (
                <AppAnalyticsPageTagCheckLoaded
                    noData={noData}
                    environments={environments}
                    {...props}
                />
            );
        },
    );
};

export default AppAnalyticsPageTagCheck;
