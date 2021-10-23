import { ReactElement } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { RowAction, RowData } from './S8Table/S8TableTypes';
import { Box } from '@mui/material';

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
                            sx={{
                                background: 'transparent',
                            }}
                            aria-label={action.tooltip}
                            disableRipple
                            disabled={action.disabled && action.disabled(row)}
                            size="large"
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
