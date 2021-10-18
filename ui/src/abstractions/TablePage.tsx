import { ReactElement } from 'react';
import S8Table from '../components/molecules/S8Table/S8Table';
import { QueryResult } from '@apollo/client/react/types/types';
import {
    Column,
    CoupleAction,
    EmptyAction,
    FieldAction,
    FreeAction,
    Order,
    RowAction,
    RowData,
} from '../components/molecules/S8Table/S8TableTypes';
import { useTableStateManager } from '../hooks/table/useTableStateManager';
import { InfoProps } from '../components/molecules/InfoButton';
import { PageActionProps } from '../actions/PageActions';
import { queryLoaderAndError } from './QueryLoaderAndError';
import { useLoggedInState } from '../context/AppContext';
import { AlertWarning } from '../components/atoms/AlertWarning';

export type TablePageProps<Row extends RowData, TableData> = {
    title: string;
    mainInfoProps?: InfoProps;
    mainQuery: QueryResult<TableData>;
    tableId: string;
    entityName: string;
    columns: Column<Row>[];
    mapTableData: (queryData: TableData) => Row[];
    buildFieldActions?: (pageActionProps: PageActionProps) => FieldAction<Row>[];
    buildRowActions?: (pageActionProps: PageActionProps) => RowAction<Row>[];
    buildFreeActions?: (pageActionProps: PageActionProps) => FreeAction[];
    buildCoupleActions?: (pageActionProps: PageActionProps) => CoupleAction[];
    buildEmptyAction?: (pageActionProps: PageActionProps) => EmptyAction;
    defaultOrderBy?: keyof Row;
    defaultOrder?: Order;
    tableLockOnRevision?: (data: TableData) => boolean;
    buildTableRevisionCloneAction?: (data: TableData) => () => void;
};

const TablePage = <Row extends RowData, TableData>(
    props: TablePageProps<Row, TableData>,
): ReactElement => {
    const {
        mainQuery,
        tableId,
        title,
        mainInfoProps,
        columns,
        mapTableData,
        buildFieldActions,
        buildRowActions,
        buildFreeActions,
        buildCoupleActions,
        buildEmptyAction,
        defaultOrderBy,
        defaultOrder,
    } = props;

    const { templateInteractions } = useLoggedInState();
    const { dispatchDialogAction } = templateInteractions;

    const tableStateManager = useTableStateManager<Row>(
        tableId,
        defaultOrderBy === undefined ? 'createdAt' : defaultOrderBy,
        defaultOrder === undefined ? 'desc' : defaultOrder,
        title,
        columns,
        mainInfoProps,
    );

    const resetTable = () => {
        tableStateManager.setOrder('desc');
        tableStateManager.setOrderBy('createdAt');
        tableStateManager.setPage(0);
    };

    return queryLoaderAndError<TableData>(
        true,
        mainQuery,
        (data: TableData, valuesRefresh: (mustResetCache: boolean) => void) => {
            // TableLock
            const tableLockOnRevision =
                props.tableLockOnRevision === undefined || data === undefined
                    ? false
                    : props.tableLockOnRevision(data);

            // Revision Clone Action
            const tableRevisionCloneAction =
                props.buildTableRevisionCloneAction === undefined
                    ? false
                    : props.buildTableRevisionCloneAction(data);

            const pageActionProps: PageActionProps = {
                dispatchDialogAction,
                refresh: (mustResetTable: boolean, mustResetCache: boolean) => {
                    valuesRefresh(mustResetCache);
                    if (mustResetTable) {
                        resetTable();
                    }
                },
            };

            const tableProps = {
                data: mapTableData(data),
                fieldActions: [
                    ...(buildFieldActions === undefined ? [] : buildFieldActions(pageActionProps)),
                ],
                rowActions: [
                    ...(buildRowActions === undefined ? [] : buildRowActions(pageActionProps)),
                ],
                freeActions: [
                    ...(buildFreeActions === undefined ? [] : buildFreeActions(pageActionProps)),
                ],
                coupleActions:
                    buildCoupleActions === undefined
                        ? undefined
                        : buildCoupleActions(pageActionProps),
                emptyAction:
                    buildEmptyAction === undefined ? undefined : buildEmptyAction(pageActionProps),
                tableStateManager,
            };

            return (
                <div>
                    {tableLockOnRevision && (
                        <AlertWarning>
                            This revision has been marked as final. No further changes are possible.{' '}
                            {tableRevisionCloneAction && (
                                <>
                                    Please{' '}
                                    <span
                                        style={{
                                            color: 'inherit',
                                            textDecoration: 'underline',
                                            cursor: 'pointer',
                                        }}
                                        onClick={tableRevisionCloneAction}
                                    >
                                        <b>clone</b>
                                    </span>{' '}
                                    the revision to continue working on it.
                                </>
                            )}
                        </AlertWarning>
                    )}
                    <S8Table<Row> {...tableProps} actionsLocked={tableLockOnRevision} />
                </div>
            );
        },
    );
};

export { TablePage };
