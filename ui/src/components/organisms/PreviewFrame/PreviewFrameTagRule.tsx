import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { TagElementContainer } from '../../molecules/TagElementContainer';
import { PreviewFrameData_getRevision_tags_rule_groups_rules } from '../../../gql/generated/PreviewFrameData';
import RuleSection from '../../atoms/RuleSection';
import { extractCurrentElementLog, ruleHasError } from '../../../utils/PreviewUtils';
import TagElementReadOnlyList from '../../molecules/TagElementReadOnlyList';
import { Box, Typography } from '@material-ui/core';
import { PreviewFrameActionGroupDistribution } from './PreviewFrameActionGroupDistribution';
import { ConditionRule, RuleEvent } from '../../../types/TagRulesTypes';
import PreviewFrameRuleHeader, {
    PreviewFrameRuleHeaderProps,
} from '../../molecules/PreviewFrameRuleHeader';
import {
    conditionsToListItems,
    eventsToListItems,
    exceptionsToListItems,
} from '../../../utils/ElementListUtils';
import Alert from '@material-ui/lab/Alert';
import { previewFrameContext } from '../../../context/PreviewFrameContext';
import {
    ActionGroupDistributionStatus,
    ConditionRuleStatus,
    EventStatus,
    RuleStatus,
} from '../../../types/PreviewFrameTypes';

type PreviewFrameTagRuleProps = {
    ruleStatuses: RuleStatus[];
    ruleData: PreviewFrameData_getRevision_tags_rule_groups_rules;
    ruleGroupCompleted: boolean;
};

const PreviewFrameTagRule: FC<PreviewFrameTagRuleProps> = (props: PreviewFrameTagRuleProps) => {
    const { ruleStatuses: rawStatuses, ruleData, ruleGroupCompleted } = props;

    const { gotoElement, currentTagCode, revisionStatus } = useContext(previewFrameContext);

    const [ruleIndex, setRuleIndex] = useState(0);

    const ruleStatuses: RuleStatus[] = useMemo(
        () =>
            [...rawStatuses]
                .map((_) => ({
                    ..._,
                    hasErrors: ruleHasError(
                        currentTagCode,
                        ruleData.id,
                        _.index,
                        revisionStatus === undefined ? [] : revisionStatus.log,
                    ),
                }))
                .sort((a, b) => b.index - a.index),
        [rawStatuses],
    );

    useEffect(() => {
        if (rawStatuses.length > 0) {
            const firstError = ruleStatuses.find((_) => _.hasErrors === true);
            if (firstError === undefined) {
                setRuleIndex(ruleStatuses[0].index);
            } else {
                setRuleIndex(firstError.index);
            }
        }
    }, [ruleStatuses]);

    const ruleStatus = ruleStatuses.find((_) => _.index === ruleIndex) || rawStatuses[0];

    const ruleHeaderProps: PreviewFrameRuleHeaderProps = {
        ruleIndex,
        setRuleIndex,
        ruleStatuses,
        ruleName: ruleData.name,
        ruleGroupCompleted,
    };

    const findStatus: <T extends Record<string, any>>(
        id: string,
        idKey: string,
        emptyValue: T,
        elements?: T[],
    ) => T = <T extends Record<string, any>>(
        id: string,
        idKey: string,
        emptyValue: T,
        elements?: T[],
    ) => {
        if (elements === undefined) {
            return emptyValue;
        }
        const status: T | undefined = elements.find((_) => _[idKey] === id);

        if (status === undefined) {
            return emptyValue;
        }

        return status;
    };

    const getEventStatus: (eventId: string) => EventStatus = (eventId: string) => {
        return findStatus<EventStatus>(
            eventId,
            'eventId',
            { eventId, passing: false },
            ruleStatus.events,
        );
    };

    const getConditionStatus: (conditionRuleId: string) => ConditionRuleStatus = (
        conditionRuleId: string,
    ) => {
        return findStatus<ConditionRuleStatus>(
            conditionRuleId,
            'conditionRuleId',
            { conditionRuleId, info: '', passing: false },
            ruleStatus.conditionRules,
        );
    };

    const getExceptionStatus: (conditionRuleId: string) => ConditionRuleStatus = (
        conditionRuleId: string,
    ) => {
        return findStatus<ConditionRuleStatus>(
            conditionRuleId,
            'conditionRuleId',
            { conditionRuleId, info: '', passing: false },
            ruleStatus.exceptionRules,
        );
    };

    const getActionGroupDistributionStatus: (
        actionGroupDistributionId: string,
    ) => ActionGroupDistributionStatus = (actionGroupDistributionId: string) => {
        return findStatus<ActionGroupDistributionStatus>(
            actionGroupDistributionId,
            'actionGroupDistributionId',
            { actionGroupDistributionId, actionGroups: [], executed: false },
            ruleStatus.actionGroupDistributions,
        );
    };

    if (rawStatuses.length === 0 || ruleStatus === undefined) {
        return (
            <>
                <Alert severity="error">
                    Missing status for rule {ruleData.name} ({ruleData.id})
                </Alert>
            </>
        );
    }

    return (
        <TagElementContainer
            readonly={true}
            applied={ruleStatus.applied}
            id={ruleData.id}
            title={ruleData.name}
            actions={[]}
            ruleGroupCompleted={ruleGroupCompleted}
            noHeader
        >
            <PreviewFrameRuleHeader {...ruleHeaderProps} />
            <RuleSection main="If" secondary="the events, conditions and exceptions are all met">
                {ruleData.trigger.parent_type === 'REVISION' && (
                    <Box fontSize="15px" color="#888888" fontWeight="normal" paddingBottom={1}>
                        Global Trigger: {ruleData.trigger.name}
                    </Box>
                )}

                <Box
                    paddingLeft={ruleData.trigger.parent_type === 'REVISION' ? 2 : 0}
                    paddingTop={ruleData.trigger.parent_type === 'REVISION' ? 1 : 0}
                    marginBottom={ruleData.trigger.parent_type === 'REVISION' ? 3 : 0}
                    borderLeft={
                        ruleData.trigger.parent_type === 'REVISION'
                            ? '1px solid rgba(0, 0, 0, 0.12)'
                            : 'none'
                    }
                >
                    <TagElementReadOnlyList
                        title="Events"
                        itemName="event"
                        itemType="event"
                        items={eventsToListItems(ruleData.trigger.events as RuleEvent[]).map(
                            (_) => ({
                                ..._,
                                log: extractCurrentElementLog(
                                    'event',
                                    currentTagCode,
                                    ruleData.id,
                                    ruleIndex,
                                    _.id,
                                    revisionStatus === undefined ? [] : revisionStatus.log,
                                ),
                                applied: getEventStatus(_.id).passing,
                            }),
                        )}
                        appliedVerb={'Passing'}
                        ruleGroupCompleted={ruleGroupCompleted}
                        gotoElement={gotoElement}
                    />
                    <TagElementReadOnlyList
                        title="Conditions"
                        itemName="condition"
                        itemType="condition"
                        items={conditionsToListItems(
                            ruleData.trigger.condition_rules as ConditionRule[],
                        ).map((_) => ({
                            ..._,
                            log: extractCurrentElementLog(
                                'condition',
                                currentTagCode,
                                ruleData.id,
                                ruleIndex,
                                _.id,
                                revisionStatus === undefined ? [] : revisionStatus.log,
                            ),
                            applied: getConditionStatus(_.id).passing,
                        }))}
                        appliedVerb={'Passing'}
                        ruleGroupCompleted={ruleGroupCompleted}
                        gotoElement={gotoElement}
                    />
                    <TagElementReadOnlyList
                        title="Exceptions"
                        itemName="exception"
                        itemType="condition"
                        items={exceptionsToListItems(
                            ruleData.trigger.exception_rules as ConditionRule[],
                        ).map((_) => ({
                            ..._,
                            log: extractCurrentElementLog(
                                'condition',
                                currentTagCode,
                                ruleData.id,
                                ruleIndex,
                                _.id,
                                revisionStatus === undefined ? [] : revisionStatus.log,
                            ),
                            applied: getExceptionStatus(_.id).passing,
                        }))}
                        appliedVerb={'Passing'}
                        ruleGroupCompleted={ruleGroupCompleted}
                        gotoElement={gotoElement}
                    />
                </Box>
            </RuleSection>
            <RuleSection main="Then" secondary="perform the following">
                {ruleData.action_groups_distributions.length === 0 && (
                    <Typography>No action group distribution defined.</Typography>
                )}
                {ruleData.action_groups_distributions.map((actionGroupsDistribution) => (
                    <PreviewFrameActionGroupDistribution
                        key={actionGroupsDistribution.id}
                        actionGroupDistributionData={actionGroupsDistribution}
                        actionGroupDistributionStatus={getActionGroupDistributionStatus(
                            actionGroupsDistribution.id,
                        )}
                        ruleContext={{
                            ruleGroupCompleted,
                            ruleIndex,
                            ruleId: ruleData.id,
                        }}
                    />
                ))}
            </RuleSection>
        </TagElementContainer>
    );
};

export { PreviewFrameTagRule };
