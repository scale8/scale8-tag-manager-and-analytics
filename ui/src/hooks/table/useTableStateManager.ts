import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Column, Order, RowData } from '../../components/molecules/S8Table/S8TableTypes';
import { InfoProps } from '../../components/molecules/InfoButton';

export interface TableStateManager<T extends RowData> {
    title: string;
    mainInfoProps?: InfoProps;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    order: Order;
    setOrder: Dispatch<SetStateAction<Order>>;
    orderBy: keyof T;
    setOrderBy: Dispatch<SetStateAction<keyof T>>;
    columns: Column<T>[];
    setColumns: Dispatch<SetStateAction<Column<T>[]>>;
    filter: string;
    setFilter: Dispatch<SetStateAction<string>>;
    selected: string[];
    setSelected: Dispatch<SetStateAction<string[]>>;
    rowsPerPage: number;
    setRowsPerPage: Dispatch<SetStateAction<number>>;
}

// Java’s String.hashCode() replacement
const hashCode = (s: string) => {
    let hash = 0;

    for (let i = 0; i < s.length; i++) {
        const chr = s.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

const useTableStateManager = <T extends RowData>(
    tableId: string,
    defaultOrderBy: keyof T,
    defaultOrder: Order,
    title: string,
    initialColumns: Column<T>[],
    mainInfoProps?: InfoProps,
): TableStateManager<T> => {
    const columnHash = hashCode(JSON.stringify(initialColumns));
    const storageId = `Table-${tableId}-${columnHash}`;

    const [storedTableStateSerialised, setStoredTableStateSerialised] = useState<string | null>(
        null,
    );
    const [newTableStateSerialised, setNewTableStateSerialised] = useState<string | null>(null);

    const tableInitialState: {
        page: number;
        order: Order;
        orderBy: keyof T;
        columns: Column<T>[];
        filter: string;
        selected: string[];
        rowsPerPage: number;
    } = storedTableStateSerialised
        ? JSON.parse(storedTableStateSerialised)
        : {
              page: 0,
              order: defaultOrder,
              orderBy: defaultOrderBy,
              columns: initialColumns,
              filter: '',
              selected: [],
              rowsPerPage: 10,
          };

    const [page, setPage] = useState(tableInitialState.page ?? 0);
    const [order, setOrder] = useState<Order>(tableInitialState.order);
    const [orderBy, setOrderBy] = useState<keyof T>(tableInitialState.orderBy);
    const [filter, setFilter] = useState(tableInitialState.filter);
    const [columns, setColumns] = useState(tableInitialState.columns);
    const [selected, setSelected] = useState<string[]>(tableInitialState.selected);
    const [rowsPerPage, setRowsPerPage] = useState(tableInitialState.rowsPerPage);

    useEffect(() => {
        setStoredTableStateSerialised(localStorage.getItem(storageId));
    }, [storageId]);

    useEffect(() => {
        setNewTableStateSerialised(
            JSON.stringify({
                order,
                orderBy,
                columns,
                rowsPerPage,
            }),
        );
    }, [storageId, order, orderBy, columns, rowsPerPage]);

    useEffect(() => {
        if (
            newTableStateSerialised !== null &&
            storedTableStateSerialised !== newTableStateSerialised
        ) {
            localStorage.setItem(storageId, newTableStateSerialised);
        }
    }, [storageId, storedTableStateSerialised, newTableStateSerialised]);

    const serialiseFixedColumnsElements = (columns: Column<T>[]) => {
        return columns.reduce(
            (accumulator, currentValue) =>
                accumulator +
                `${currentValue.title}${JSON.stringify(currentValue.columnInfoProps)}${
                    currentValue.field
                }${Object.keys(currentValue).filter((_) => _ !== 'hidden')}`,
            '',
        );
    };

    if (serialiseFixedColumnsElements(columns) !== serialiseFixedColumnsElements(initialColumns)) {
        setColumns(initialColumns);
    }

    return {
        title,
        mainInfoProps,
        page,
        setPage,
        order,
        setOrder,
        orderBy,
        setOrderBy,
        columns: columns ?? initialColumns,
        setColumns,
        filter: filter ?? '',
        setFilter,
        selected: selected ?? [],
        setSelected,
        rowsPerPage: rowsPerPage ?? 10,
        setRowsPerPage,
    };
};

export { useTableStateManager };
