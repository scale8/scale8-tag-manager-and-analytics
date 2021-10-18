import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { DynamicPageProps } from '../pageLoader/DynamicPageLoader';
import { useLoggedInState } from '../context/AppContext';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { GlobalActionPageData } from '../gql/generated/GlobalActionPageData';
import PageGlobalActionContentQuery from '../gql/queries/PageGlobalActionContentQuery';
import { PageActionProps } from '../actions/PageActions';
import NonTablePageContainer from '../components/molecules/NonTablePageContainer';
import { ActionGroupDistributionSection } from '../components/organisms/Sections/ActionGroupDistributionSection';
import { ActionGroupDistribution } from '../types/TagRulesTypes';
import { buildStandardMainInfo } from '../utils/InfoLabelsUtils';
import { AlertRevisionFinal } from '../components/atoms/AlertRevisionFinal';
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
                <div>
                    {data.getActionGroupDistribution.revision.locked && (
                        <AlertRevisionFinal
                            pageActionProps={pageActionProps}
                            revisionId={data.getActionGroupDistribution.revision.id}
                            navigateBack={() =>
                                router.push(toAppRevision({ id }), 'global-actions').then()
                            }
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
                </div>
            );
        },
        true,
    );
};

export default GlobalActionPage;
