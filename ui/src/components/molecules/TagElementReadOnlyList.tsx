import { FC } from 'react';
import { Box, Divider, List, ListItem } from '@mui/material';
import TagElementReadOnlyListItem from './TagElementReadOnlyListItem';
import { TagElementListItem } from '../../utils/ElementListUtils';
import { PreviewElementDetails, PreviewElementType } from '../../types/PreviewFrameTypes';

type TagElementListProps = {
    title: string;
    items: TagElementListItem[];
    itemType: PreviewElementType;
    appliedVerb?: string;
    ruleGroupCompleted?: boolean;
    itemName: string;
    gotoElement: PreviewElementDetails | undefined;
};

const TagElementReadOnlyList: FC<TagElementListProps> = (props: TagElementListProps) => {
    return (
        <Box paddingBottom={3}>
            <Box color="#888888" fontSize="13px">
                {props.title}
            </Box>
            <Divider />
            <List
                dense
                style={{
                    paddingTop: '0',
                }}
            >
                {props.items.length === 0 && (
                    <>
                        <ListItem>
                            <Box color="#888888" fontSize="13px">
                                No {props.itemName} defined.
                            </Box>
                        </ListItem>
                        <Divider />
                    </>
                )}
                {props.items.map((item) => (
                    <TagElementReadOnlyListItem
                        key={item.id}
                        item={item}
                        ruleGroupCompleted={props.ruleGroupCompleted}
                        itemType={props.itemType}
                        appliedVerb={props.appliedVerb}
                        gotoElement={props.gotoElement}
                    />
                ))}
            </List>
        </Box>
    );
};

export default TagElementReadOnlyList;
