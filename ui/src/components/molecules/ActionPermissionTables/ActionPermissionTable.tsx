import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { UpdateActionPermissionProps } from '../ActionPermissions/ActionPermissionSection';
import { ApolloError } from '@apollo/client/errors';
import AddIcon from '@mui/icons-material/Add';
import { VariableReadWriteExecuteScopeInput } from '../../../types/ActionPermissionsTypes';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useLoggedInState } from '../../../context/AppContext';

const useStyles = makeStyles((theme) =>
    createStyles({
        light: {
            color: theme.palette.secondary.main,
            '& th, & td': {
                color: theme.palette.secondary.main,
            },
        },
        tableRow: {
            '&:last-of-type td, &:last-of-type th': {
                borderBottom: 0,
            },
        },
        addButton: {
            marginTop: theme.spacing(1),
        },
        checkbox: {
            '&:hover': {
                backgroundColor: 'transparent',
            },
        },
    }),
);

export type ActionPermissionTableRowProps = {
    eventName?: string;
    host?: string;
    variableScope?: VariableReadWriteExecuteScopeInput;
    index: number;
    editIndex: number;
    commit: (newElement: ActionPermissionElementType, index: number) => void;
    cancel: () => void;
    deleteRow: (deleteIndex: number) => void;
    editRow: (editIndex: number) => void;
    readOnly: boolean;
};

type ActionPermissionBooleanColumnProps = {
    checked: boolean;
    editMode: boolean;
    editChecked: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const ActionPermissionBooleanColumn: FC<ActionPermissionBooleanColumnProps> = (
    props: ActionPermissionBooleanColumnProps,
) => {
    const classes = useStyles();

    const { editMode, editChecked, checked, onChange } = props;

    return (
        <TableCell width={100} align="center">
            {editMode ? (
                <Checkbox
                    className={classes.checkbox}
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    checked={editChecked}
                    disableRipple
                    color="default"
                    onChange={onChange}
                />
            ) : checked ? (
                <Box marginX="16px">✓</Box>
            ) : (
                <Box marginX="16px">✗</Box>
            )}
        </TableCell>
    );
};

const ActionPermissionTableRow: FC<ActionPermissionTableRowProps> = (
    props: ActionPermissionTableRowProps,
) => {
    const classes = useStyles();
    const { eventName, host, variableScope, index, editIndex, commit, cancel, deleteRow, editRow } =
        props;

    const [editEventName, setEditEventName] = useState<string>('');
    const [editHost, setEditHost] = useState<string>('');
    const [editVariableName, setEditVariableName] = useState<string>('');
    const [editRead, setEditRead] = useState<boolean>(false);
    const [editWrite, setEditWrite] = useState<boolean>(false);
    const [editExecute, setEditExecute] = useState<boolean>(false);

    useEffect(() => {
        if (index === editIndex && eventName !== undefined) {
            setEditEventName(eventName);
        }
        if (index === editIndex && host !== undefined) {
            setEditHost(host);
        }
        if (index === editIndex && variableScope !== undefined) {
            setEditVariableName(variableScope.name);
            setEditRead(variableScope.read);
            setEditWrite(variableScope.write);
            setEditExecute(variableScope.execute);
        }
    }, [variableScope, eventName, host, index, editIndex]);

    return (
        <TableRow className={classes.tableRow}>
            {eventName !== undefined && (
                <TableCell component="th" scope="row" width={450}>
                    {index === editIndex ? (
                        <TextField
                            variant="standard"
                            fullWidth
                            value={editEventName}
                            onChange={(
                                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                            ) => {
                                setEditEventName(event.target.value);
                            }}
                        />
                    ) : (
                        eventName
                    )}
                </TableCell>
            )}
            {host !== undefined && (
                <TableCell component="th" scope="row" width={450}>
                    {index === editIndex ? (
                        <TextField
                            variant="standard"
                            fullWidth
                            value={editHost}
                            onChange={(
                                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                            ) => {
                                setEditHost(event.target.value);
                            }}
                        />
                    ) : (
                        host
                    )}
                </TableCell>
            )}
            {variableScope !== undefined && (
                <>
                    <TableCell component="th" scope="row" width={170}>
                        {index === editIndex ? (
                            <TextField
                                variant="standard"
                                value={editVariableName}
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                                ) => {
                                    setEditVariableName(event.target.value);
                                }}
                            />
                        ) : (
                            variableScope.name
                        )}
                    </TableCell>
                    <ActionPermissionBooleanColumn
                        checked={variableScope.read}
                        editMode={index === editIndex}
                        editChecked={editRead}
                        onChange={(event) => {
                            setEditRead(event.target.checked);
                        }}
                    />
                    <ActionPermissionBooleanColumn
                        checked={variableScope.write}
                        editMode={index === editIndex}
                        editChecked={editWrite}
                        onChange={(event) => {
                            setEditWrite(event.target.checked);
                        }}
                    />
                    <ActionPermissionBooleanColumn
                        checked={variableScope.execute}
                        editMode={index === editIndex}
                        editChecked={editExecute}
                        onChange={(event) => {
                            setEditExecute(event.target.checked);
                        }}
                    />
                </>
            )}

            <TableCell align="right">
                {index === editIndex ? (
                    <>
                        <IconButton aria-label="cancel" onClick={cancel} size="small">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            aria-label="confirm"
                            onClick={() => {
                                if (eventName !== undefined) {
                                    commit(editEventName, index);
                                }

                                if (host !== undefined) {
                                    commit(editHost, index);
                                }

                                if (variableScope !== undefined) {
                                    commit(
                                        {
                                            name: editVariableName,
                                            read: editRead,
                                            write: editWrite,
                                            execute: editExecute,
                                        },
                                        index,
                                    );
                                }
                            }}
                            size="small"
                        >
                            <CheckIcon fontSize="small" />
                        </IconButton>
                    </>
                ) : (
                    !props.readOnly && (
                        <>
                            <IconButton
                                aria-label="delete"
                                onClick={() => {
                                    editRow(index);
                                }}
                                size="small"
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                aria-label="delete"
                                onClick={() => {
                                    deleteRow(index);
                                }}
                                size="small"
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </>
                    )
                )}
            </TableCell>
        </TableRow>
    );
};

type ActionPermissionElementType = VariableReadWriteExecuteScopeInput | string;

type ActionPermissionTableValues = {
    variableReadWriteExecuteScopes?: VariableReadWriteExecuteScopeInput[];
    hostMatches?: string[];
    eventNames?: string[];
};

export type ActionPermissionTableProps = UpdateActionPermissionProps & {
    permissionElementKey: keyof ActionPermissionTableValues;
    emptyError: string;
    duplicateError: string;
    title: string;
    submitText: string;
};

const ActionPermissionTable: FC<ActionPermissionTableProps> = (
    props: ActionPermissionTableProps,
) => {
    const classes = useStyles();

    const { templateInteractions } = useLoggedInState();
    const { setSnackbarError } = templateInteractions;

    const {
        permission,
        updatePermission,
        permissionElementKey,
        emptyError,
        duplicateError,
        title,
        submitText,
    } = props;

    const elements: undefined | ActionPermissionElementType[] = permission[permissionElementKey];

    const [editIndex, setEditIndex] = useState<number>(-2);

    const findName = (element: ActionPermissionElementType): string =>
        element.hasOwnProperty('name')
            ? (element as VariableReadWriteExecuteScopeInput).name
            : (element as string);

    const commit = (newElement: ActionPermissionElementType, index: number) => {
        if (findName(newElement) === '') {
            setSnackbarError({
                message: emptyError,
            } as ApolloError);
            setEditIndex(-2);
            return;
        }

        const nameUnchanged =
            index > -1 &&
            elements !== undefined &&
            findName(elements[index]) === findName(newElement);

        if (
            elements?.find(
                (_: ActionPermissionElementType) => findName(_) === findName(newElement),
            ) !== undefined &&
            !nameUnchanged
        ) {
            setSnackbarError({
                message: duplicateError,
            } as ApolloError);
            setEditIndex(-2);
            return;
        }

        if (index === -1) {
            updatePermission(permission, {
                ...permission,
                [permissionElementKey]:
                    elements === undefined ? [newElement] : [...elements, newElement],
            });
            setEditIndex(-2);
        } else {
            updatePermission(permission, {
                ...permission,
                [permissionElementKey]:
                    elements === undefined
                        ? [newElement]
                        : elements.map((_, i) => {
                              if (i === index) {
                                  return newElement;
                              } else {
                                  return _;
                              }
                          }),
            });
            setEditIndex(-2);
        }
    };

    const cancel = () => {
        setEditIndex(-2);
    };

    const deleteKey = (deleteIndex: number) => {
        updatePermission(permission, {
            ...permission,
            [permissionElementKey]:
                elements === undefined ? [] : elements.filter((_, index) => index !== deleteIndex),
        });
    };

    const editKey = (editIndex: number) => {
        setEditIndex(editIndex);
    };

    return (
        <>
            <Box mt={3} className={classes.light}>
                {title}
            </Box>
            {(editIndex === -1 || (elements !== undefined && elements.length > 0)) && (
                <Table className={classes.light}>
                    <TableHead>
                        {permissionElementKey === 'eventNames' && (
                            <TableRow>
                                <TableCell width={450}>Name</TableCell>
                                <TableCell />
                            </TableRow>
                        )}
                        {permissionElementKey === 'hostMatches' && (
                            <TableRow>
                                <TableCell width={450}>Host</TableCell>
                                <TableCell />
                            </TableRow>
                        )}
                        {permissionElementKey === 'variableReadWriteExecuteScopes' && (
                            <TableRow>
                                <TableCell width={170}>Name</TableCell>
                                <TableCell width={100} align="center">
                                    Read
                                </TableCell>
                                <TableCell width={100} align="center">
                                    Write
                                </TableCell>
                                <TableCell width={100} align="center">
                                    Execute
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        )}
                    </TableHead>
                    <TableBody>
                        {elements !== undefined &&
                            elements.map((element: ActionPermissionElementType, index: number) => (
                                <ActionPermissionTableRow
                                    key={index}
                                    eventName={
                                        permissionElementKey === 'eventNames'
                                            ? (element as string)
                                            : undefined
                                    }
                                    host={
                                        permissionElementKey === 'hostMatches'
                                            ? (element as string)
                                            : undefined
                                    }
                                    variableScope={
                                        permissionElementKey === 'variableReadWriteExecuteScopes'
                                            ? (element as VariableReadWriteExecuteScopeInput)
                                            : undefined
                                    }
                                    index={index}
                                    editIndex={editIndex}
                                    commit={commit}
                                    cancel={cancel}
                                    deleteRow={deleteKey}
                                    editRow={editKey}
                                    readOnly={props.readOnly}
                                />
                            ))}
                        {editIndex === -1 && (
                            <ActionPermissionTableRow
                                eventName={permissionElementKey === 'eventNames' ? '' : undefined}
                                host={permissionElementKey === 'hostMatches' ? '' : undefined}
                                variableScope={
                                    permissionElementKey === 'variableReadWriteExecuteScopes'
                                        ? {
                                              name: '',
                                              read: false,
                                              write: false,
                                              execute: false,
                                          }
                                        : undefined
                                }
                                index={-1}
                                editIndex={editIndex}
                                commit={commit}
                                cancel={cancel}
                                deleteRow={deleteKey}
                                editRow={editKey}
                                readOnly={props.readOnly}
                            />
                        )}
                    </TableBody>
                </Table>
            )}
            {!props.readOnly && (
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                        setEditIndex(-1);
                    }}
                    startIcon={<AddIcon />}
                    className={classes.addButton}
                    disabled={editIndex !== -2}
                >
                    {submitText}
                </Button>
            )}
        </>
    );
};

export { ActionPermissionTable };
