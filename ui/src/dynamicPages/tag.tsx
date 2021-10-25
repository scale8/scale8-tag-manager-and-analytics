import { FC, Fragment } from 'react';
import { Box } from '@mui/material';
import { useQuery } from '@apollo/client';
import { DynamicPageProps } from '../pageLoader/DynamicPageLoader';
import { useLoggedInState } from '../context/AppContext';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { TagContentPageData } from '../gql/generated/TagContentPageData';
import PageTagContentQuery from '../gql/queries/PageTagContentQuery';
import { PageActionProps, pageActions } from '../actions/PageActions';
import { useRouter } from 'next/router';
import { toAppRevision } from '../utils/NavigationPaths';
import NonTablePageContainer from '../components/molecules/NonTablePageContainer';
import { buildStandardMainInfo } from '../utils/InfoLabelsUtils';
import RuleContainerDivider from '../components/atoms/RuleContainerDivider';
import { RuleGroupPageSection } from '../components/organisms/Sections/RuleGroupPageSection';
import { RuleGroup } from '../types/TagRulesTypes';
import RulesAddButton from '../components/atoms/RulesAddButton';
import { AlertRevisionFinal } from '../components/atoms/AlertRevisionFinal';

const RulesPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const tagId = props.params.id ?? '';

    const router = useRouter();

    const { templateInteractions } = useLoggedInState();
    const { dispatchDialogAction } = templateInteractions;

    return queryLoaderAndError<TagContentPageData>(
        true,
        useQuery(PageTagContentQuery, {
            variables: { id: tagId },
        }),
        (data: TagContentPageData, valuesRefresh: (mustResetCache: boolean) => void) => {
            const pageActionProps: PageActionProps = {
                dispatchDialogAction,
                refresh: (mustResetTable: boolean, mustResetCache: boolean) => {
                    valuesRefresh(mustResetCache);
                },
            };

            return (
                <Box>
                    {data.getTag.revision.locked && (
                        <AlertRevisionFinal
                            onCloneLinkClick={() => {
                                pageActions.duplicateAppRevision(
                                    pageActionProps,
                                    data.getTag.revision.id,
                                    (
                                        id: string,
                                        pageRefresh: () => void,
                                        handleDialogClose: (checkChanges: boolean) => void,
                                    ) => {
                                        handleDialogClose(false);
                                        router.push(toAppRevision({ id }, 'tags')).then();
                                    },
                                );
                            }}
                        />
                    )}
                    <NonTablePageContainer title="Rules" {...buildStandardMainInfo('rules')}>
                        {data.getTag.rule_groups.map((ruleGroup, ruleGroupIndex) => (
                            <Fragment key={ruleGroup.id}>
                                {ruleGroupIndex !== 0 && <RuleContainerDivider text="And" />}
                                <RuleGroupPageSection
                                    ruleGroup={ruleGroup as RuleGroup}
                                    ruleGroupIndex={ruleGroupIndex}
                                    ruleGroupsIds={data.getTag.rule_groups.map(
                                        (ruleGroup) => ruleGroup.id,
                                    )}
                                    tagId={tagId}
                                    valuesRefresh={valuesRefresh}
                                    revisionLocked={data.getTag.revision.locked}
                                    pageActionProps={pageActionProps}
                                />
                            </Fragment>
                        ))}
                        <RulesAddButton
                            text="Add Rule Group"
                            onClick={() => pageActions.createRuleGroup(pageActionProps, tagId)}
                            disabled={data.getTag.revision.locked}
                        />
                    </NonTablePageContainer>
                </Box>
            );
        },
        true,
    );
};

export default RulesPage;
