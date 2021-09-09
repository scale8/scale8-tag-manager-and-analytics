import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useRouter } from 'next/router';
import { DynamicPageProps } from '../pageLoader/DynamicPageLoader';
import { useLoggedInState } from '../context/AppContext';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { GlobalActionPageData } from '../gql/generated/GlobalActionPageData';
import PageGlobalActionContentQuery from '../gql/queries/PageGlobalActionContentQuery';
import { PageActionProps, pageActions } from '../actions/PageActions';
import NonTablePageContainer from '../components/molecules/NonTablePageContainer';
import { ActionGroupDistributionSection } from '../components/organisms/Sections/ActionGroupDistributionSection';
import { ActionGroupDistribution } from '../types/TagRulesTypes';
import { buildStandardMainInfo } from '../utils/InfoLabelsUtils';
import { toAppRevision } from '../utils/NavigationPaths';

const GlobalActionPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';

    const router = useRouter();
    const { templateInteractions } = useLoggedInState();
    const { dispatchDialogAction } = templateInteractions;

    return queryLoaderAndError<GlobalActionPageData>(
        false,
        useQuery(PageGlobalActionContentQuery, {
            variables: { id },
        }),
        (data: GlobalActionPageData, valuesRefresh: (mustResetCache: boolean) => void) => {
            const pageActionProps: PageActionProps = {
                dispatchDialogAction,
                refresh: (mustResetTable: boolean, mustResetCache: boolean) => {
                    valuesRefresh(mustResetCache);
                },
            };

            return (
                <Box>
                    {data.getActionGroupDistribution.revision.locked && (
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
                                        data.getActionGroupDistribution.revision.id,
                                        (
                                            id: string,
                                            pageRefresh: () => void,
                                            handleDialogClose: (checkChanges: boolean) => void,
                                        ) => {
                                            handleDialogClose(false);
                                            router
                                                .push(toAppRevision({ id }), 'global-actions')
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
                        title="Global Action"
                        {...buildStandardMainInfo('rules')}
                    >
                        <ActionGroupDistributionSection
                            valuesRefresh={valuesRefresh}
                            actionGroupsDistribution={
                                data.getActionGroupDistribution as ActionGroupDistribution
                            }
                            readOnly={data.getActionGroupDistribution.revision.locked}
                            pageActionProps={pageActionProps}
                        />
                    </NonTablePageContainer>
                </Box>
            );
        },
        true,
    );
};

export default GlobalActionPage;
