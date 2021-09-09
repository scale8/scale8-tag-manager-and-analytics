import { FC } from 'react';
import { Alert } from '@material-ui/lab';
import { Box } from '@material-ui/core';
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
                        <Alert severity="warning">
                            This revision has been marked as final. No further changes are possible.
                            Please{' '}
                            <span
                                style={{
                                    color: 'inherit',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
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
                                                .push(toAppRevision({ id }), 'global-triggers')
                                                .then();
                                        },
                                    );
                                }}
                            >
                                <b>clone</b>
                            </span>{' '}
                            the revision to continue working on it.
                        </Alert>
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
