import { FC } from 'react';
import { ActionsPageSection } from './ActionsPageSection';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import { ActionGroup } from '../../../types/TagRulesTypes';
import { PageActionProps, pageActions } from '../../../actions/PageActions';
import { DistributionElementContainer } from '../../molecules/DistributionElementContainer';
import { moveDownId, moveUpId } from '../../../utils/ArrayUtils';
import { SectionAction } from '../../molecules/SectionActionsSpeedDial';
import { useConfigState } from '../../../context/AppContext';

type ActionGroupSectionProps = {
    actionGroup: ActionGroup;
    actionGroupIndex: number;
    actionGroupsIds: string[];
    actionGroupsDistributionId: string;
    distributionValues: {
        id: string;
        distributionValue: number;
        isLocked: boolean;
    };
    setDistributionValue: (id: string, value: number) => void;
    setActionGroupLock: (id: string, locked: boolean) => void;
    commitDistribution: () => void;
    revisionLocked: boolean;
    pageActionProps: PageActionProps;
};

const ActionGroupPageSection: FC<ActionGroupSectionProps> = (props: ActionGroupSectionProps) => {
    const {
        actionGroup,
        actionGroupIndex,
        distributionValues,
        actionGroupsIds,
        actionGroupsDistributionId,
        setActionGroupLock,
        setDistributionValue,
        commitDistribution,
        revisionLocked,
        pageActionProps,
    } = props;

    const { isAuditEnabled } = useConfigState();

    return (
        <DistributionElementContainer
            readonly={revisionLocked}
            key={actionGroup.id}
            id={actionGroup.id}
            title={actionGroup.name}
            distribution={distributionValues.distributionValue}
            locked={distributionValues.isLocked}
            setActionGroupLock={setActionGroupLock}
            setDistributionValue={setDistributionValue}
            commitDistribution={commitDistribution}
            actions={[
                ...([
                    {
                        icon: <FileCopyIcon />,
                        name: 'Duplicate',
                        onClick: (id, event) => {
                            pageActions.duplicateActionGroup(pageActionProps, id);
                            event.currentTarget.blur();
                        },
                    },
                    {
                        icon: <ArrowDownwardIcon />,
                        name: 'Move Down',
                        onClick: (id, event) => {
                            pageActions.updateActionGroupOrder(
                                pageActionProps,
                                actionGroupsDistributionId,
                                moveDownId(actionGroupsIds, id),
                            );
                            event.currentTarget.blur();
                        },
                        disabled: actionGroupIndex === actionGroupsIds.length - 1,
                    },
                    {
                        icon: <ArrowUpwardIcon />,
                        name: 'Move Up',
                        onClick: (id, event) => {
                            pageActions.updateActionGroupOrder(
                                pageActionProps,
                                actionGroupsDistributionId,
                                moveUpId(actionGroupsIds, id),
                            );
                            event.currentTarget.blur();
                        },
                        disabled: actionGroupIndex === 0,
                    },
                    {
                        icon: <DeleteIcon />,
                        name: 'Delete',
                        onClick: (id, event) => {
                            pageActions.deleteActionGroup(pageActionProps, id);
                            event.currentTarget.blur();
                        },
                    },
                    {
                        icon: <EditIcon />,
                        name: 'Edit',
                        onClick: (id, event) => {
                            pageActions.updateActionGroup(pageActionProps, id);
                            event.currentTarget.blur();
                        },
                    },
                ] as SectionAction[]),
                ...((isAuditEnabled
                    ? [
                          {
                              icon: <HistoryIcon />,
                              name: 'History',
                              onClick: (id, event) => {
                                  pageActions.showActionGroupHistory(
                                      pageActionProps,
                                      id,
                                      actionGroup.name,
                                  );
                                  event.currentTarget.blur();
                              },
                          },
                      ]
                    : []) as SectionAction[]),
            ]}
        >
            <ActionsPageSection
                actions={actionGroup.actions}
                actionGroupId={actionGroup.id}
                actionGroupsDistributionId={actionGroupsDistributionId}
                revisionLocked={revisionLocked}
                pageActionProps={pageActionProps}
            />
        </DistributionElementContainer>
    );
};

export { ActionGroupPageSection };
