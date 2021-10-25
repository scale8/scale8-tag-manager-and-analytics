import { ReactElement } from 'react';

import TableCell from '@mui/material/TableCell';
import { BulkAction, CoupleAction, RowData } from './S8TableTypes';
import Checkbox from '@mui/material/Checkbox';

interface S8TableRowSelectCellProps<T extends RowData> {
    index: number;
    row: T;
    isItemSelected: boolean;
    toggleSelect: (id: string) => void;
    disableSelection: boolean;
    bulkActions?: BulkAction[];
    coupleActions?: CoupleAction[];
}

const S8TableRowSelectCell = <T extends RowData>(
    props: S8TableRowSelectCellProps<T>,
): ReactElement<any, any> | null => {
    const {
        index,
        row,
        isItemSelected,
        disableSelection,
        toggleSelect,
        bulkActions,
        coupleActions,
    } = props;
    const checkboxId = `s8-table-checkbox-${index}`;

    if (bulkActions === undefined && coupleActions === undefined) {
        return null;
    }

    return (
        <TableCell padding="checkbox" id={checkboxId} component="th" scope="row">
            <Checkbox
                onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(row.id);
                }}
                disabled={disableSelection}
                checked={isItemSelected}
                inputProps={{
                    'aria-labelledby': checkboxId,
                }}
            />
        </TableCell>
    );
};
export default S8TableRowSelectCell;
