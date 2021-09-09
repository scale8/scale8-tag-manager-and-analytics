import { FC, Fragment, MouseEventHandler } from 'react';
import {
    Box,
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import HistoryIcon from '@material-ui/icons/History';
import { TagElementListItem } from '../../utils/ElementListUtils';

const useStyles = makeStyles(() => ({
    list: {
        paddingTop: '0',
    },
    addButton: {},
    addButtonContainer: {
        width: '100%',
    },
    listItem: {
        paddingRight: '160px',
    },
}));

type TagElementListProps = {
    title: string;
    items: TagElementListItem[];
    addButtonText: string;
    addButtonClick: MouseEventHandler;
    deleteButtonClick: (id: string, name: string) => void;
    editButtonClick?: (id: string, name: string) => void;
    inspectButtonClick?: (id: string, name: string) => void;
    historyButtonClick?: (id: string, name: string) => void;
    moveUpClick?: (id: string, name: string) => void;
    moveDownClick?: (id: string, name: string) => void;
    disabled?: boolean;
};

const TagElementList: FC<TagElementListProps> = (props: TagElementListProps) => {
    const classes = useStyles();

    return (
        <Box paddingBottom={3}>
            <Box color="#888888" fontSize="13px">
                {props.title}
            </Box>
            <Divider />
            <List dense className={classes.list}>
                {props.items.map((item, index) => (
                    <Fragment key={item.id}>
                        <ListItem className={classes.listItem}>
                            {item.icon !== undefined && (
                                <ListItemIcon
                                    style={{
                                        minWidth: '10px',
                                        paddingRight: '10px',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                            )}
                            <ListItemText primary={item.text} />
                            <ListItemSecondaryAction>
                                <>
                                    {!props.disabled ||
                                        (props.inspectButtonClick && (
                                            <IconButton
                                                edge="end"
                                                aria-label="inspect"
                                                onClick={() => {
                                                    if (props.inspectButtonClick !== undefined)
                                                        props.inspectButtonClick(
                                                            item.id,
                                                            item.text,
                                                        );
                                                }}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        ))}
                                    {!props.disabled && props.historyButtonClick && (
                                        <IconButton
                                            edge="end"
                                            aria-label="inspect"
                                            onClick={() => {
                                                if (props.historyButtonClick !== undefined)
                                                    props.historyButtonClick(item.id, item.text);
                                            }}
                                        >
                                            <HistoryIcon />
                                        </IconButton>
                                    )}
                                    {props.disabled ||
                                        (props.editButtonClick && (
                                            <IconButton
                                                edge="end"
                                                aria-label="inspect"
                                                onClick={() => {
                                                    if (props.editButtonClick !== undefined)
                                                        props.editButtonClick(item.id, item.text);
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        ))}
                                    {!props.disabled && (
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => {
                                                props.deleteButtonClick(item.id, item.text);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                    {!props.disabled && props.moveUpClick && (
                                        <IconButton
                                            edge="end"
                                            aria-label="Move Up"
                                            onClick={() => {
                                                if (props.moveUpClick !== undefined)
                                                    props.moveUpClick(item.id, item.text);
                                            }}
                                            disabled={index === 0}
                                        >
                                            <ArrowUpwardIcon />
                                        </IconButton>
                                    )}
                                    {!props.disabled && props.moveDownClick && (
                                        <IconButton
                                            edge="end"
                                            aria-label="Move Down"
                                            onClick={() => {
                                                if (props.moveDownClick !== undefined)
                                                    props.moveDownClick(item.id, item.text);
                                            }}
                                            disabled={index === props.items.length - 1}
                                        >
                                            <ArrowDownwardIcon />
                                        </IconButton>
                                    )}
                                </>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                    </Fragment>
                ))}
            </List>
            <div className={classes.addButtonContainer}>
                <Button
                    size="small"
                    className={classes.addButton}
                    variant="outlined"
                    color="default"
                    startIcon={<AddIcon />}
                    onClick={props.addButtonClick}
                    disabled={props.disabled}
                >
                    {props.addButtonText}
                </Button>
            </div>
        </Box>
    );
};

export default TagElementList;
