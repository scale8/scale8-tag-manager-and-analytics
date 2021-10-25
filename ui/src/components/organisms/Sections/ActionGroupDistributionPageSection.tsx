import { FC } from 'react';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    ActionGroupDistributionSection,
    ActionGroupDistributionSectionProps,
} from './ActionGroupDistributionSection';
import HistoryIcon from '@mui/icons-material/History';
import { SectionAction } from '../../molecules/SectionActionsSpeedDial';
import { pageActions } from '../../../actions/PageActions';
import { moveDownId, moveUpId } from '../../../utils/ArrayUtils';
import { InnerTagElementContainer } from '../../molecules/InnerTagElementContainer';
import { toGlobalAction } from '../../../utils/NavigationPaths';
import { useConfigState } from '../../../context/AppContext';

type ActionGroupDistributionPageSectionProps = ActionGroupDistributionSectionProps & {
    actionGroupsDistributionIndex: number;
    actionGroupsDistributionsIds: string[];
    ruleId: string;
};

const ActionGroupDistributionPageSection: FC<ActionGroupDistributionPageSectionProps> = (
    props: ActionGroupDistributionPageSectionProps,
) => {
    const {
        actionGroupsDistributionIndex,
        actionGroupsDistributionsIds,
        readOnly,
        ruleId,
        ...actionGroupDistributionSectionProps
    } = props;

    const { isAuditEnabled } = useConfigState();

    const { actionGroupsDistribution, pageActionProps } = actionGroupDistributionSectionProps;

    const customDistributionActions: SectionAction[] = [
        ...([
            {
                icon: <FileCopyIcon />,
                name: 'Duplicate',
                onClick: (id, event) => {
                    pageActions.duplicateActionGroupDistribution(pageActionProps, id);
                    event.currentTarget.blur();
                },
            },
            {
                icon: <ArrowDownwardIcon />,
                name: 'Move Down',
                onClick: (id, event) => {
                    pageActions.updateActionGroupDistributionOrder(
                        pageActionProps,
                        ruleId,
                        moveDownId(actionGroupsDistributionsIds, id),
                    );
                    event.currentTarget.blur();
                },
                disabled: actionGroupsDistributionIndex === actionGroupsDistributionsIds.length - 1,
            },
            {
                icon: <ArrowUpwardIcon />,
                name: 'Move Up',
                onClick: (id, event) => {
                    pageActions.updateActionGroupDistributionOrder(
                        pageActionProps,
                        ruleId,
                        moveUpId(actionGroupsDistributionsIds, id),
                    );
                    event.currentTarget.blur();
                },
                disabled: actionGroupsDistributionIndex === 0,
            },
            {
                icon: <DeleteIcon />,
                name: 'Delete',
                onClick: (id, event) => {
                    pageActions.deleteActionGroupDistribution(pageActionProps, id);
                    event.currentTarget.blur();
                },
            },
            {
                icon: <EditIcon />,
                name: 'Edit',
                onClick: (id, event) => {
                    pageActions.updateActionGroupDistribution(pageActionProps, id);
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
                          pageActions.showActionGroupDistributionHistory(
                              pageActionProps,
                              id,
                              actionGroupsDistribution.name,
                          );
                          event.currentTarget.blur();
                      },
                  },
              ]
            : []) as SectionAction[]),
    ];

    const linkedDistributionActions: SectionAction[] = [
        {
            icon: <ArrowDownwardIcon />,
            name: 'Move Down',
            onClick: (id, event) => {
                pageActions.updateActionGroupDistributionOrder(
                    pageActionProps,
                    ruleId,
                    moveDownId(actionGroupsDistributionsIds, id),
                );
                event.currentTarget.blur();
            },
            disabled: actionGroupsDistributionIndex === actionGroupsDistributionsIds.length - 1,
        },
        {
            icon: <ArrowUpwardIcon />,
            name: 'Move Up',
            onClick: (id, event) => {
                pageActions.updateActionGroupDistributionOrder(
                    pageActionProps,
                    ruleId,
                    moveUpId(actionGroupsDistributionsIds, id),
                );
                event.currentTarget.blur();
            },
            disabled: actionGroupsDistributionIndex === 0,
        },
        {
            icon: <DeleteIcon />,
            name: 'Delete',
            onClick: (id, event) => {
                pageActions.unlinkActionGroupDistribution(pageActionProps, id, ruleId);
                event.currentTarget.blur();
            },
        },
    ];

    return (
        <InnerTagElementContainer
            key={actionGroupsDistribution.id}
            id={actionGroupsDistribution.id}
            highlight={actionGroupsDistribution.parent_type === 'REVISION'}
            title={
                actionGroupsDistribution.parent_type === 'REVISION'
                    ? 'Global Action Group Distribution: '
                    : actionGroupsDistribution.name
            }
            link={
                actionGroupsDistribution.parent_type === 'REVISION'
                    ? {
                          text: actionGroupsDistribution.name,
                          href: toGlobalAction({ id: actionGroupsDistribution.id }),
                      }
                    : undefined
            }
            readonly={readOnly}
            actions={
                actionGroupsDistribution.parent_type === 'REVISION'
                    ? linkedDistributionActions
                    : customDistributionActions
            }
        >
            <ActionGroupDistributionSection
                readOnly={readOnly || actionGroupsDistribution.parent_type === 'REVISION'}
                {...actionGroupDistributionSectionProps}
            />
        </InnerTagElementContainer>
    );
};

export { ActionGroupDistributionPageSection };
