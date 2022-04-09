import { FC, ReactNode, useContext } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { TabularData } from '../../molecules/TabularData';
import { kebabToTitleCase } from '../../../utils/TextUtils';
import { previewFrameContext } from '../../../context/PreviewFrameContext';
import { RuleVarStatus } from '../../../types/PreviewFrameTypes';
import { Segment } from '@mui/icons-material';

const PreviewFrameDataLayers: FC = () => {
    const { revisionStatus, previewFrameData } = useContext(previewFrameContext);

    const tags = previewFrameData === undefined ? [] : previewFrameData.getRevision.tags;

    const ruleTitlesMap = new Map<string, ReactNode>();

    tags.forEach((tag) =>
        tag.rule_groups.forEach((ruleGroup) =>
            ruleGroup.rules.forEach((rule) => {
                ruleTitlesMap.set(
                    rule.id,
                    <span>
                        Variables visible only from rule: <b>{rule.name}</b> of rule group:{' '}
                        <b>{ruleGroup.name}</b>
                    </span>,
                );
            }),
        ),
    );

    if (revisionStatus === undefined || previewFrameData === undefined) {
        return (
            <Box
                height="50px"
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <CircularProgress color="inherit" size={20} />
            </Box>
        );
    }

    const ruleVarsByRuleId = revisionStatus.ruleVars.reduce((p, c) => {
        return {
            ...p,
            [c.ruleId]: p[c.ruleId] === undefined ? [c] : [...p[c.ruleId], c],
        };
    }, {} as Record<string, RuleVarStatus[]>);

    return (
        <>
            <TabularData
                source={revisionStatus.globalVars.map((_) => [
                    kebabToTitleCase(_.dataContainerPersistenceId),
                    _.values,
                ])}
            />
            {Object.entries(ruleVarsByRuleId).map(([ruleId, ruleVars]) => {
                return (
                    <Segment key={ruleId}>
                        <Box mt={3} />
                        <TabularData
                            title={ruleTitlesMap.get(ruleId)}
                            source={ruleVars.map((_) => [
                                kebabToTitleCase(_.dataContainerPersistenceId),
                                _.values,
                            ])}
                        />
                    </Segment>
                );
            })}
            <Box mt={3} />
        </>
    );
};

export { PreviewFrameDataLayers };
