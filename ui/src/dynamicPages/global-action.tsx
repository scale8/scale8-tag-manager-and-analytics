import { FC } from 'react';
import { useQuery } from '@apollo/client';
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
import { Box } from '@mui/material';
import { AlertRevisionFinal } from '../components/atoms/AlertRevisionFinal';

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
                        <AlertRevisionFinal
                            onCloneLinkClick={() => {
                                pageActions.duplicateAppRevision(
                                    pageActionProps,
                                    data.getActionGroupDistribution.revision.id,
                                    (
                                        id: string,
                                        pageRefresh: () => void,
                                        handleDialogClose: (checkChanges: boolean) => void,
                                    ) => {
                                        handleDialogClose(false);
                                        router.push(toAppRevision({ id }, 'global-actions')).then();
                                    },
                                );
                            }}
                        />
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
