import { FC } from 'react';
import { Box } from '@mui/material';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { DynamicPageProps } from '../pageLoader/DynamicPageLoader';
import { useLoggedInState } from '../context/AppContext';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { GlobalTriggerPageData } from '../gql/generated/GlobalTriggerPageData';
import PageGlobalTriggerContentQuery from '../gql/queries/PageGlobalTriggerContentQuery';
import { PageActionProps, pageActions } from '../actions/PageActions';
import NonTablePageContainer from '../components/molecules/NonTablePageContainer';
import { TriggerSection } from '../components/organisms/Sections/TriggerSection';
import { Trigger } from '../types/TagRulesTypes';
import { buildStandardMainInfo } from '../utils/InfoLabelsUtils';
import { toAppRevision } from '../utils/NavigationPaths';
import { AlertRevisionFinal } from '../components/atoms/AlertRevisionFinal';

const GlobalTriggerPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const triggerId = props.params.id ?? '';

    const router = useRouter();
    const { templateInteractions } = useLoggedInState();
    const { dispatchDialogAction } = templateInteractions;

    return queryLoaderAndError<GlobalTriggerPageData>(
        true,
        useQuery(PageGlobalTriggerContentQuery, {
            variables: { id: triggerId },
        }),
        (data: GlobalTriggerPageData, valuesRefresh: (mustResetCache: boolean) => void) => {
            const pageActionProps: PageActionProps = {
                dispatchDialogAction,
                refresh: (mustResetTable: boolean, mustResetCache: boolean) => {
                    valuesRefresh(mustResetCache);
                },
            };

            return (
                <Box>
                    {data.getTrigger.revision.locked && (
                        <AlertRevisionFinal
                            onCloneLinkClick={() => {
                                pageActions.duplicateAppRevision(
                                    pageActionProps,
                                    data.getTrigger.revision.id,
                                    (
                                        id: string,
                                        pageRefresh: () => void,
                                        handleDialogClose: (checkChanges: boolean) => void,
                                    ) => {
                                        handleDialogClose(false);
                                        router
                                            .push(toAppRevision({ id }, 'global-triggers'))
                                            .then();
                                    },
                                );
                            }}
                        />
                    )}
                    <NonTablePageContainer
                        title="Global Trigger"
                        {...buildStandardMainInfo('globalTriggers')}
                    >
                        <TriggerSection
                            trigger={data.getTrigger as Trigger}
                            readonly={data.getTrigger.revision.locked}
                            pageActionProps={pageActionProps}
                        />
                    </NonTablePageContainer>
                </Box>
            );
        },
        true,
    );
};

export default GlobalTriggerPage;
