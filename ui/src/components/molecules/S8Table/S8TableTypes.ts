import { MouseEvent, ReactElement } from 'react';
import { SvgIconComponent } from '@material-ui/icons';
import { TableStateManager } from '../../../hooks/table/useTableStateManager';
import { InfoProps } from '../InfoButton';

export type Order = 'asc' | 'desc';

export type RowData = {
    id: string;
    [key: string]: any;
};

export interface FieldAction<RowData extends Record<string, unknown>> {
    onClick: (data: RowData, event: any) => void;
    tooltip: string;
    field: keyof RowData;
    disabled?: (data: RowData) => boolean;
}

export interface RowAction<RowData extends Record<string, unknown>> {
    icon: (() => ReactElement) | SvgIconComponent;
    onClick: (data: RowData, toggleRowSelect: () => void, event: any) => void;
    tooltip: string;
    disabled?: (data: RowData) => boolean;
    hidden?: (data: RowData) => boolean;
    unLockable?: boolean;
}

export interface FreeAction {
    icon: (() => ReactElement) | SvgIconComponent;
    onClick: (event: any) => void;
    tooltip: string;
    disabled?: boolean;
    hidden?: boolean;
    unLockable?: boolean;
}

export interface EmptyAction {
    onClick: (event: any) => void;
    text: string;
}

export interface BulkAction {
    icon: (() => ReactElement) | SvgIconComponent;
    onClick: (ids: string[], event: any) => void;
    tooltip: string;
    unLockable?: boolean;
}

export interface CoupleAction {
    icon: (() => ReactElement) | SvgIconComponent;
    onClick: (leftId: string, rightId: string, event: any) => void;
    tooltip: string;
    unLockable?: boolean;
}

export type TableData<T extends RowData> = T[];

export type TableRowClickHandler<T extends RowData> = (
    data: T,
    toggleRowSelect: () => void,
    event: MouseEvent,
) => void;

export type TableDataActionsProps<T extends RowData> = {
    data: TableData<T>;
    fieldActions?: FieldAction<T>[];
    rowActions?: RowAction<T>[];
    freeActions?: FreeAction[];
    bulkActions?: BulkAction[];
    emptyAction?: EmptyAction;
    coupleActions?: CoupleAction[];
    rowClickHandler?: TableRowClickHandler<T>;
    actionsLocked?: boolean;
    tableStateManager: TableStateManager<T>;
};

export type FieldType = 'boolean' | 'numeric' | 'datetime' | 'string' | 'graph';

export type Column<T extends RowData> = {
    title: string;
    columnInfoProps?: InfoProps;
    field: keyof T;
    type: FieldType;
    hidden?: boolean;
};

export type ColumnBuilderBase<T extends RowData> = {
    field: keyof T;
    type?: FieldType;
    title?: string;
    columnInfoId?: string;
    columnInfoSide?: 'left' | 'right';
    hidden?: boolean;
};

export type S8TableProps<T extends RowData> = TableDataActionsProps<T>;
