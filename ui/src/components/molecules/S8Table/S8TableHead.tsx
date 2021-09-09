import { ChangeEvent, MouseEvent, ReactElement } from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { BulkAction, Column, CoupleAction, Order, RowAction, RowData } from './S8TableTypes';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { InfoButton } from '../InfoButton';
import { Box } from '@material-ui/core';
import { getInfo } from '../../../info/getInfo';

interface S8TableHeadProps<T extends RowData> {
    columns: Column<T>[];
    numSelected: number;
    onRequestSort: (event: MouseEvent<unknown>, property: keyof T) => void;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: keyof T;
    rowCount: number;
    rowActions?: RowAction<T>[];
    bulkActions?: BulkAction[];
    coupleActions?: CoupleAction[];
}

const useStyles = makeStyles(() =>
    createStyles({
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    }),
);

const S8TableHead = <T extends RowData>(
    props: S8TableHeadProps<T>,
): ReactElement<any, any> | null => {
    const classes = useStyles();

    const {
        columns,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        rowActions,
        bulkActions,
        coupleActions,
    } = props;
    const createSortHandler = (property: keyof T) => (event: MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {(bulkActions || coupleActions) && (
                    <TableCell padding="checkbox">
                        <Checkbox
                            disabled={
                                bulkActions === undefined &&
                                coupleActions !== undefined &&
                                numSelected === 0
                            }
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'select all' }}
                        />
                    </TableCell>
                )}
                {columns.map((column, index) => (
                    <TableCell
                        style={{
                            whiteSpace: 'nowrap',
                        }}
                        key={column.field.toString()}
                        align={column.type === 'numeric' ? 'right' : 'left'}
                        padding={index === 0 && bulkActions ? 'none' : 'normal'}
                        sortDirection={orderBy === column.field ? order : false}
                    >
                        <TableSortLabel
                            hideSortIcon={
                                column.columnInfoProps !== undefined &&
                                getInfo(column.columnInfoProps.id) !== ''
                            }
                            active={orderBy === column.field}
                            direction={orderBy === column.field ? order : 'asc'}
                            onClick={createSortHandler(column.field)}
                        >
                            <Box component="span" mr="3px" mb="2px" lineHeight="18px">
                                {column.title}
                            </Box>
                            {orderBy === column.field ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                        {column.columnInfoProps !== undefined &&
                            getInfo(column.columnInfoProps.id) !== '' && (
                                <InfoButton {...column.columnInfoProps} />
                            )}
                    </TableCell>
                ))}
                {rowActions && rowActions.length > 0 && (
                    <TableCell align="center">Actions</TableCell>
                )}
            </TableRow>
        </TableHead>
    );
};
export default S8TableHead;
