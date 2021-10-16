import { ChangeEvent, MouseEvent, ReactElement, ReactNode } from 'react';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import clsx from 'clsx';
import { getComparator, stableSort } from '../../../utils/ArrayUtils';
import { FieldAction, FieldType, RowData, S8TableProps } from './S8TableTypes';
import { Box, Button, TablePagination, Tooltip } from '@mui/material';
import S8TableToolbar from './S8TableToolBar';
import S8TableHead from './S8TableHead';
import S8TableRowActionsCell from './S8TableRowActionsCell';
import S8TableRowSelectCell from './S8TableRowSelectCell';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { timestampDisplay } from '../../../utils/DateTimeUtils';
import { navigationColorFromSectionLocator } from '../../../containers/SectionsDetails';
import { useLoggedInState } from '../../../context/AppContext';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            flex: '1 0 auto',
        },
        table: {
            minWidth: 750,
        },
        footer: {
            flexShrink: 0,
            height: 52,
        },
        clickableCell: {
            cursor: 'pointer',
            '& .value': {
                display: 'inline-block',
                borderBottom: '1px dotted #000000',
            },
            '&:hover .value': {
                borderBottom: '1px solid #000000',
            },
        },
    }),
);

const S8Table = <T extends RowData>(props: S8TableProps<T>): ReactElement => {
    const {
        data: unfilteredData,
        fieldActions,
        rowActions,
        freeActions,
        bulkActions,
        emptyAction,
        coupleActions,
        rowClickHandler,
        tableStateManager,
        actionsLocked,
    } = props;

    const {
        title,
        mainInfoProps,
        page,
        setPage,
        order,
        setOrder,
        orderBy,
        setOrderBy,
        columns,
        setColumns,
        filter,
        setFilter,
        selected,
        setSelected,
        rowsPerPage,
        setRowsPerPage,
    } = tableStateManager;

    const { templateInteractions } = useLoggedInState();
    const { sectionHistory } = templateInteractions;
    const navigationColor = navigationColorFromSectionLocator(sectionHistory.current);

    const classes = useStyles();

    const visibleColumns = columns.filter((_) => !_.hidden);

    const data = unfilteredData.filter((row: T) => {
        if (filter === '') return true;
        let found = false;
        Object.values(row).forEach((value) => {
            if (!found) {
                found = value.toString().toUpperCase().includes(filter.toUpperCase());
            }
        });
        return found;
    });

    const handleRequestSort = (event: MouseEvent<unknown>, property: keyof T) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        // Couple selection, can only deselect
        if (bulkActions === undefined && coupleActions !== undefined) {
            setSelected([]);
            return;
        }
        if (event.target.checked) {
            const newSelected = data.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const toggleSelect = (id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    const renderValue = (type: FieldType, value: any): ReactNode => {
        switch (type) {
            case 'boolean':
                return value ? 'Yes' : 'No';
            case 'graph':
                return (
                    <Box width={150}>
                        <Sparklines data={value} width={150} height={30}>
                            <SparklinesLine style={{ fill: 'none' }} />
                        </Sparklines>
                    </Box>
                );
            case 'numeric':
                return value.toString();
            case 'datetime': {
                return timestampDisplay(value);
            }
            default:
                return value;
        }
    };

    const columnsNumber =
        visibleColumns.length +
        (rowActions !== undefined ? 1 : 0) +
        (coupleActions !== undefined ? 1 : 0) +
        (bulkActions !== undefined ? 1 : 0);

    const emptyTableBody = (
        <TableBody>
            <TableRow>
                <TableCell align="center" colSpan={columnsNumber}>
                    {emptyAction !== undefined ? (
                        <Box padding={6}>
                            <Button
                                onClick={emptyAction.onClick}
                                variant="contained"
                                color="primary"
                                style={{
                                    color: '#ffffff',
                                    background: navigationColor,
                                }}
                            >
                                {emptyAction.text}
                            </Button>
                        </Box>
                    ) : (
                        <Box padding={6}>No records to display</Box>
                    )}
                </TableCell>
            </TableRow>
        </TableBody>
    );

    const findCurrentFieldAction = (field: keyof T, row: T): FieldAction<T> | undefined => {
        if (fieldActions === undefined) {
            return undefined;
        }
        const currentFieldAction = fieldActions.find((_) => _.field === field);
        if (currentFieldAction === undefined) {
            return undefined;
        }
        if (currentFieldAction.disabled && currentFieldAction.disabled(row)) {
            return undefined;
        }
        return currentFieldAction;
    };

    const tableBody = (
        <TableBody>
            {stableSort<T>(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                    const isItemSelected = isSelected(row.id);

                    const disableSelection =
                        bulkActions === undefined &&
                        coupleActions !== undefined &&
                        selected.length === 2 &&
                        !isItemSelected;

                    return (
                        <TableRow
                            hover
                            onClick={(e) => {
                                e.stopPropagation();
                                if (selected.length > 0) {
                                    if (!disableSelection) {
                                        toggleSelect(row.id);
                                    }
                                    return;
                                }
                                rowClickHandler &&
                                    rowClickHandler(row, () => toggleSelect(row.id), e);
                            }}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                        >
                            <S8TableRowSelectCell<T>
                                index={index}
                                row={row}
                                isItemSelected={isItemSelected}
                                toggleSelect={toggleSelect}
                                bulkActions={bulkActions}
                                coupleActions={coupleActions}
                                disableSelection={disableSelection}
                            />
                            {visibleColumns.map((column, index) => (
                                <TableCell
                                    key={column.field.toString()}
                                    align={column.type === 'numeric' ? 'right' : 'left'}
                                    padding={
                                        index === 0 && (bulkActions || coupleActions)
                                            ? 'none'
                                            : 'normal'
                                    }
                                    className={clsx(
                                        findCurrentFieldAction(column.field, row) !== undefined &&
                                            classes.clickableCell,
                                    )}
                                    onClick={(
                                        e:
                                            | MouseEvent<HTMLTableHeaderCellElement>
                                            | MouseEvent<HTMLTableDataCellElement>,
                                    ) => {
                                        e.stopPropagation();

                                        const currentFieldAction = findCurrentFieldAction(
                                            column.field,
                                            row,
                                        );

                                        if (currentFieldAction !== undefined) {
                                            currentFieldAction.onClick(row, e);
                                        }
                                    }}
                                >
                                    {findCurrentFieldAction(column.field, row) ? (
                                        <Tooltip
                                            title={
                                                findCurrentFieldAction(column.field, row)
                                                    ?.tooltip ?? ''
                                            }
                                        >
                                            <div className="value">
                                                {renderValue(column.type, row[column.field])}
                                            </div>
                                        </Tooltip>
                                    ) : (
                                        renderValue(column.type, row[column.field])
                                    )}
                                </TableCell>
                            ))}
                            <S8TableRowActionsCell<T>
                                index={index}
                                row={row}
                                toggleSelect={toggleSelect}
                                rowActions={rowActions}
                                actionsLocked={actionsLocked}
                            />
                        </TableRow>
                    );
                })}
        </TableBody>
    );

    return (
        <div className={classes.root}>
            <S8TableToolbar
                selected={selected}
                title={title}
                mainInfoProps={mainInfoProps}
                freeActions={freeActions}
                coupleActions={coupleActions}
                bulkActions={bulkActions}
                actionsLocked={actionsLocked}
                filter={filter}
                setFilter={setFilter}
                columns={columns}
                setColumns={setColumns}
            />
            <TableContainer className={classes.content}>
                <Table className={classes.table}>
                    <S8TableHead<T>
                        columns={visibleColumns}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={unfilteredData.length}
                        rowActions={rowActions}
                        bulkActions={bulkActions}
                        coupleActions={coupleActions}
                    />
                    {data.length === 0 ? emptyTableBody : tableBody}
                </Table>
            </TableContainer>
            <TablePagination
                className={classes.footer}
                rowsPerPageOptions={[10, 20, 50, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};
export default S8Table;
