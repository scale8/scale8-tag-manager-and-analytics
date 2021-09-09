import { ReactElement } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { RowAction, RowData } from './S8Table/S8TableTypes';
import { Box } from '@material-ui/core';

interface BreadcrumbActionsProps<T extends RowData> {
    row: T;
    rowActions?: RowAction<T>[];
}

const BreadcrumbActions = <T extends RowData>(
    props: BreadcrumbActionsProps<T>,
): ReactElement<any, any> | null => {
    const { row, rowActions } = props;

    if (rowActions === undefined) {
        return null;
    }

    return (
        <Box>
            {rowActions.map((action, i) => (
                <Tooltip key={i} title={action.tooltip}>
                    <span>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(
                                    row,
                                    () => {
                                        // No selection
                                    },
                                    e,
                                );
                            }}
                            color="inherit"
                            style={{
                                background: 'transparent',
                            }}
                            aria-label={action.tooltip}
                            disableRipple
                            disabled={action.disabled && action.disabled(row)}
                        >
                            <action.icon />
                        </IconButton>
                    </span>
                </Tooltip>
            ))}
        </Box>
    );
};
export default BreadcrumbActions;
