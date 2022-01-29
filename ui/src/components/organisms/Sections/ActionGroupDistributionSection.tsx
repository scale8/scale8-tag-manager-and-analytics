import { FC, useCallback, useEffect, useState } from 'react';
import { ActionsPageSection } from './ActionsPageSection';
import { ActionGroupPageSection } from './ActionGroupPageSection';
import { useMutation } from '@apollo/client';
import { ActionGroupDistribution } from '../../../types/TagRulesTypes';
import { ValuesRefreshFunction } from '../../../types/GqlTypes';
import { PageActionProps, pageActions } from '../../../actions/PageActions';
import UpdateActionGroupsQuery from '../../../gql/mutations/UpdateActionGroupsQuery';
import {
    ActionGroupDistributionType,
    ActionGroupUpdateInput,
} from '../../../gql/generated/globalTypes';
import { logError } from '../../../utils/logUtils';
import { SmallAddButton } from '../../atoms/SmallAddButton';

export type ActionGroupDistributionSectionProps = {
    actionGroupsDistribution: ActionGroupDistribution;
    valuesRefresh: ValuesRefreshFunction;
    readOnly: boolean;
    pageActionProps: PageActionProps;
};

export type Distribution = {
    id: string;
    distributionValue: number;
    isLocked: boolean;
};

const ActionGroupDistributionSection: FC<ActionGroupDistributionSectionProps> = (
    props: ActionGroupDistributionSectionProps,
) => {
    const { actionGroupsDistribution, valuesRefresh, readOnly, pageActionProps } = props;

    const [distribution, setDistribution] = useState<Distribution[]>(
        actionGroupsDistribution.action_groups.map((actionGroup) => {
            return {
                id: actionGroup.id,
                distributionValue: actionGroup.distribution,
                isLocked: actionGroup.is_locked,
            };
        }),
    );

    const [redistributed, setRedistributed] = useState(false);

    const [updateActionGroups, { data }] = useMutation(UpdateActionGroupsQuery);

    const flushDistribution = () => {
        (async () => {
            const actionGroupUpdateInputs: ActionGroupUpdateInput[] = distribution.map((_) => ({
                action_group_id: _.id,
                distribution: _.distributionValue,
                is_locked: _.isLocked,
            }));
            try {
                await updateActionGroups({
                    variables: { actionGroupUpdateInputs },
                });
            } catch (error) {
                logError(error);
            }
        })();
    };

    const flushDistributionCallback = useCallback(flushDistribution, []);
    const setRedistributedCallback = useCallback(setRedistributed, []);
    const valuesRefreshCallback = useCallback(valuesRefresh, []);

    useEffect(() => {
        const successfullySubmitted = data?.updateActionGroups;
        if (successfullySubmitted) {
            valuesRefreshCallback(false);
        }
    }, [data, valuesRefreshCallback]);

    useEffect(() => {
        if (
            actionGroupsDistribution.action_group_distribution_type !==
                ActionGroupDistributionType.NONE &&
            actionGroupsDistribution.action_groups.length > 0 &&
            !redistributed
        ) {
            const distributionValues: Distribution[] = actionGroupsDistribution.action_groups.map(
                (actionGroup) => {
                    return {
                        id: actionGroup.id,
                        distributionValue: actionGroup.distribution,
                        isLocked: actionGroup.is_locked,
                    };
                },
            );

            const hasUnSet = !!distributionValues.find((value) => value.distributionValue === -1);

            const total = distributionValues.reduce(
                (accumulator, current) => accumulator + current.distributionValue,
                0,
            );

            const needsBalance = hasUnSet || total !== 1000;

            if (needsBalance) {
                const unlockedGroups = distributionValues.filter((_) => !_.isLocked);

                const totalLocked = distributionValues.reduce(
                    (accumulator, current) =>
                        accumulator + (current.isLocked ? current.distributionValue : 0),
                    0,
                );

                const ignoreLocked = totalLocked + unlockedGroups.length > 1000;

                if (ignoreLocked) {
                    const newDistributionValue = Math.floor(1000 / distributionValues.length);
                    const remainder = 1000 % distributionValues.length;
                    setDistribution(
                        distributionValues.map((_, index) => ({
                            id: _.id,
                            distributionValue: newDistributionValue + (index === 0 ? remainder : 0),
                            isLocked: _.isLocked,
                        })),
                    );
                } else {
                    const unLockedDistribution = 1000 - totalLocked;
                    const newDistributionValue = Math.floor(
                        unLockedDistribution / unlockedGroups.length,
                    );

                    // reminder goes to the first unlocked
                    const firstUnlocked = distributionValues.find((_) => !_.isLocked);

                    const groupIdWithRemainder = firstUnlocked ? firstUnlocked.id : '';

                    const remainder = unLockedDistribution % unlockedGroups.length;

                    setDistribution(
                        distributionValues.map((_) => ({
                            id: _.id,
                            distributionValue: _.isLocked
                                ? _.distributionValue
                                : newDistributionValue +
                                  (_.id === groupIdWithRemainder ? remainder : 0),
                            isLocked: _.isLocked,
                        })),
                    );
                }
                setRedistributedCallback(true);
            }
        }
    }, [
        actionGroupsDistribution,
        setRedistributedCallback,
        flushDistributionCallback,
        redistributed,
    ]);

    const setActionGroupLock = (id: string, locked: boolean) => {
        setDistribution(
            distribution.map((_) =>
                _.id === id
                    ? {
                          id: _.id,
                          distributionValue: _.distributionValue,
                          isLocked: locked,
                      }
                    : _,
            ),
        );
        setRedistributed(true);
    };

    const setDistributionValue = (id: string, value: number) => {
        if (value < 1) return;
        const currentGroupValues = distribution.find((_) => _.id === id);
        if (!currentGroupValues || currentGroupValues.isLocked) return;

        const totalLocked = distribution.reduce(
            (accumulator, current) =>
                accumulator + (current.isLocked ? current.distributionValue : 0),
            0,
        );
        const unLockedDistribution = 1000 - totalLocked;

        const unlockedGroups = distribution.filter((_) => !_.isLocked);
        const otherUnlockedGroupsNumber = unlockedGroups.length - 1;

        if (otherUnlockedGroupsNumber === 0) return;

        const availableDistribution = unLockedDistribution - otherUnlockedGroupsNumber;

        if (value > availableDistribution) return;

        const newDistributionValue = Math.floor(
            (unLockedDistribution - value) / otherUnlockedGroupsNumber,
        );
        // reminder goes to the first unlocked excluding the current
        const firstUnlocked = distribution.find((_) => !_.isLocked && _.id !== id);
        const groupIdWithRemainder = firstUnlocked ? firstUnlocked.id : '';

        const remainder = (unLockedDistribution - value) % otherUnlockedGroupsNumber;

        setDistribution(
            distribution.map((_) =>
                _.id === id
                    ? {
                          id: _.id,
                          distributionValue: value,
                          isLocked: _.isLocked,
                      }
                    : {
                          id: _.id,
                          distributionValue: _.isLocked
                              ? _.distributionValue
                              : newDistributionValue +
                                (_.id === groupIdWithRemainder ? remainder : 0),
                          isLocked: _.isLocked,
                      },
            ),
        );
    };

    const commitDistribution = () => {
        setRedistributed(true);
    };

    if (redistributed) {
        flushDistribution();
        setRedistributed(false);
    }

    return actionGroupsDistribution.action_group_distribution_type ===
        ActionGroupDistributionType.NONE && actionGroupsDistribution.action_groups.length > 0 ? (
        <ActionsPageSection
            actions={actionGroupsDistribution.action_groups[0].actions}
            actionGroupId={actionGroupsDistribution.action_groups[0].id}
            actionGroupsDistributionId={actionGroupsDistribution.id}
            revisionLocked={readOnly}
            pageActionProps={pageActionProps}
        />
    ) : (
        <>
            {actionGroupsDistribution.action_groups.map((actionGroup, actionGroupIndex) => (
                <ActionGroupPageSection
                    distributionValues={
                        distribution.find((_) => _.id === actionGroup.id) ?? {
                            id: actionGroup.id,
                            distributionValue: actionGroup.distribution,
                            isLocked: actionGroup.is_locked,
                        }
                    }
                    setActionGroupLock={setActionGroupLock}
                    setDistributionValue={setDistributionValue}
                    commitDistribution={commitDistribution}
                    key={actionGroup.id}
                    actionGroup={actionGroup}
                    actionGroupIndex={actionGroupIndex}
                    actionGroupsIds={actionGroupsDistribution.action_groups.map(
                        (actionGroup) => actionGroup.id,
                    )}
                    actionGroupsDistributionId={actionGroupsDistribution.id}
                    revisionLocked={readOnly}
                    pageActionProps={pageActionProps}
                />
            ))}
            <SmallAddButton
                addButtonText="Add Action Group"
                addButtonClick={() =>
                    pageActions.createActionGroup(pageActionProps, actionGroupsDistribution.id)
                }
                disabled={readOnly}
            />
        </>
    );
};

export { ActionGroupDistributionSection };
