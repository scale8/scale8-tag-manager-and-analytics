import { ReactElement } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import TableCell from '@material-ui/core/TableCell';
import { RowAction, RowData } from './S8TableTypes';

interface S8TableRowActionsCellProps<T extends RowData> {
    index: number;
    row: T;
    toggleSelect: (id: string) => void;
    rowActions?: RowAction<T>[];
    actionsLocked?: boolean;
}

const S8TableRowActionsCell = <T extends RowData>(
    props: S8TableRowActionsCellProps<T>,
): ReactElement<any, any> | null => {
    const { index, row, toggleSelect, rowActions, actionsLocked } = props;
    const actionId = `s8-table-action-${index}`;

    if (rowActions === undefined) {
        return null;
    }

    return (
        <TableCell
            id={actionId}
            align="center"
            padding="none"
            style={{
                width: '0.1%',
                whiteSpace: 'nowrap',
                padding: '0 5px',
            }}
        >
            {rowActions.map((action, i) =>
                action.hidden && action.hidden(row) ? null : (
                    <Tooltip key={i} title={action.tooltip}>
                        <span>
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(row, () => toggleSelect(row.id), e);
                                }}
                                color="inherit"
                                aria-label={action.tooltip}
                                disabled={
                                    (action.disabled && action.disabled(row)) ||
                                    (actionsLocked && !action.unLockable)
                                }
                            >
                                <action.icon />
                            </IconButton>
                        </span>
                    </Tooltip>
                ),
            )}
        </TableCell>
    );
};
export default S8TableRowActionsCell;
