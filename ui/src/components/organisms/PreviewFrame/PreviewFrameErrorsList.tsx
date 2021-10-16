import { FC, useContext } from 'react';
import { Box, CircularProgress, useTheme } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import WarningIcon from '@mui/icons-material/Warning';
import { Action, Condition, RuleEvent } from '../../../types/TagRulesTypes';
import {
    buildFullActionName,
    buildFullConditionName,
    buildFullEventName,
} from '../../../utils/ElementListUtils';
import { previewFrameContext } from '../../../context/PreviewFrameContext';
import { PreviewElementType } from '../../../types/PreviewFrameTypes';

const PreviewFrameErrorsList: FC = () => {
    const theme = useTheme();
    const { revisionStatus, previewFrameData, setCurrentTagCode, setGotoElement } =
        useContext(previewFrameContext);

    const errors = revisionStatus?.log.filter((_) => _.isError) ?? [];

    const tags = previewFrameData === undefined ? [] : previewFrameData.getRevision.tags;

    const actionNamesMap = new Map<string, { name: string; type: string }>();
    const eventNamesMap = new Map<string, { name: string; type: string }>();
    const conditionNamesMap = new Map<string, { name: string; type: string }>();

    tags.forEach((tag) =>
        tag.rule_groups.forEach((ruleGroup) =>
            ruleGroup.rules.forEach((rule) => {
                rule.trigger.events.forEach((event) => {
                    eventNamesMap.set(event.id, {
                        name: buildFullEventName(event as RuleEvent),
                        type: 'Event',
                    });
                });
                rule.trigger.condition_rules.forEach((condition) => {
                    conditionNamesMap.set(condition.id, {
                        name: buildFullConditionName(condition as Condition),
                        type: 'Condition',
                    });
                });
                rule.trigger.exception_rules.forEach((condition) => {
                    conditionNamesMap.set(condition.id, {
                        name: buildFullConditionName(condition as Condition),
                        type: 'Exception',
                    });
                });
                rule.action_groups_distributions.forEach((actionGroupDistribution) =>
                    actionGroupDistribution.action_groups.forEach((actionGroup) =>
                        actionGroup.actions.forEach((action) =>
                            actionNamesMap.set(action.id, {
                                name: buildFullActionName(action as Action),
                                type: 'Action',
                            }),
                        ),
                    ),
                );
            }),
        ),
    );

    const findErrorItemName = (
        entityId: string,
        entityType: PreviewElementType,
    ): { name: string; type: string } => {
        if (entityType === 'action') {
            return (
                actionNamesMap.get(entityId) ?? {
                    name: 'unknown',
                    type: 'Action',
                }
            );
        }
        if (entityType === 'event') {
            return (
                eventNamesMap.get(entityId) ?? {
                    name: 'unknown',
                    type: 'Event',
                }
            );
        }
        return (
            conditionNamesMap.get(entityId) ?? {
                name: 'unknown',
                type: 'Condition',
            }
        );
    };

    return revisionStatus === undefined || previewFrameData === undefined ? (
        <Box height="50px" width="100%" display="flex" justifyContent="center" alignItems="center">
            <CircularProgress color="inherit" size={20} />
        </Box>
    ) : (
        <List dense component="nav">
            {errors.map((error, index) => (
                <ListItem
                    button
                    key={index}
                    onClick={() => {
                        setCurrentTagCode(error.tagCode);
                        setGotoElement({
                            type: error.entityType,
                            tagCode: error.tagCode,
                            id: error.entityId,
                        });
                    }}
                >
                    <ListItemText>
                        <Box component="span" mr={1} color="#0000008a">
                            {findErrorItemName(error.entityId, error.entityType).type}:
                        </Box>
                        {findErrorItemName(error.entityId, error.entityType).name}
                    </ListItemText>
                    <WarningIcon
                        style={{
                            backgroundColor: 'transparent',
                            color: theme.palette.error.main,
                            margin: '3px',
                        }}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export { PreviewFrameErrorsList };
