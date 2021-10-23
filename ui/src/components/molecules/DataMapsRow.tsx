import { FC, Fragment } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import CloseIcon from '@mui/icons-material/Close';
import clsx from 'clsx';
import { DataMapsColumn, DataMapsTable, DataMapsTableRow } from './DataMapsTable';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

type RowProps = {
    isPlatform: boolean;
    row: DataMapsTableRow;
    columns: DataMapsColumn[];
    editable: boolean;
    index: number;
    deleteHandler?: (dataMapId: string, dataMapName: string) => void;
    updateHandler?: (dataMapId: string) => void;
    inspectHandler?: (dataMapId: string) => void;
    createHandler?: (level: number, dataMapId?: string, dataMapName?: string) => void;
    level: number;
};

const useRowStyles = makeStyles({
    rowWithChildren: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    evenRow: {
        background: 'rgba(0, 0, 0, 0.03)',
    },
});

const DataMapsRow: FC<RowProps> = (props: RowProps) => {
    const {
        row,
        columns,
        editable,
        index,
        deleteHandler,
        createHandler,
        updateHandler,
        inspectHandler,
        isPlatform,
        level,
    } = props;
    const classes = useRowStyles();
    const hasChildren = row.varType === 'OBJECT' || row.varType === 'ARRAY_OBJECT';

    return (
        <Fragment>
            <TableRow
                className={clsx(
                    hasChildren && classes.rowWithChildren,
                    index % 2 !== 0 && classes.evenRow,
                )}
            >
                {columns.map((column) => (
                    <TableCell key={column.field}>{row[column.field]}</TableCell>
                ))}

                <TableCell
                    sx={{
                        width: '0.1%',
                    }}
                >
                    {editable ? (
                        <Box display="flex" justifyContent="flex-end">
                            {!hasChildren && (
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        updateHandler && updateHandler(row.id);
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            )}

                            <IconButton
                                size="small"
                                onClick={() => {
                                    deleteHandler && deleteHandler(row.id, row.key);
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    ) : !hasChildren ? (
                        <IconButton
                            size="small"
                            onClick={() => {
                                inspectHandler && inspectHandler(row.id);
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    ) : null}
                </TableCell>
            </TableRow>
            {hasChildren && (
                <TableRow className={clsx(index % 2 !== 0 && classes.evenRow)}>
                    <TableCell
                        sx={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={columns.length + 1}
                    >
                        <Box m={1}>
                            <b>Children:</b>
                        </Box>
                        <Box mx={1} my={2}>
                            <DataMapsTable
                                isPlatform={isPlatform}
                                tableData={row.children ?? []}
                                editable={editable}
                                contained={true}
                                parentId={row.id}
                                parentName={row.key}
                                deleteHandler={deleteHandler}
                                createHandler={createHandler}
                                updateHandler={updateHandler}
                                inspectHandler={inspectHandler}
                                level={level + 1}
                            />
                        </Box>
                    </TableCell>
                </TableRow>
            )}
        </Fragment>
    );
};

export { DataMapsRow };
