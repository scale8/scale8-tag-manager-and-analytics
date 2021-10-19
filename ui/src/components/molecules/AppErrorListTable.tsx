import { FC } from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import { AnchorLinkIcon } from '../atoms/AnchorLinkIcon';
import { CircularProgressWithLabel } from '../atoms/CircularProgressWithLabel';
import { AppError } from '../../lazyComponents/lists/AppErrorsList';

type AppErrorListTableProps = {
    list: AppError[];
    totalErrors: number;
    setFilter: (key: string, value: string | boolean | undefined) => void;
};

export const AppErrorListTable: FC<AppErrorListTableProps> = ({ list, totalErrors, setFilter }) => {
    const filterLinkStyles = {
        color: 'inherit',
        cursor: 'pointer',
        lineHeight: '1.5em',
        '&:hover': {
            textDecoration: 'underline',
        },
    };

    return (
        <Table aria-label="errors" size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Message</TableCell>
                    <TableCell>File</TableCell>
                    <TableCell>Line/Column</TableCell>
                    <TableCell align="right">Users affected</TableCell>
                    <TableCell align="right" width={130}>
                        Total Occurrences
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {list.map((_, index) => {
                    const addErrorFilter = () => {
                        setFilter('error_id', _.errorId);
                    };

                    return (
                        <TableRow key={index}>
                            <TableCell>
                                <Tooltip title={_.message} placement="bottom-start">
                                    <Box
                                        whiteSpace="nowrap"
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        sx={{
                                            ...filterLinkStyles,
                                            width: 'calc(45vw - 390px)',
                                        }}
                                        onClick={addErrorFilter}
                                    >
                                        {_.message}
                                    </Box>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                <Tooltip title={_.file} placement="bottom-start">
                                    <Box
                                        style={{ width: 'calc(50vw - 400px)' }}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="left"
                                    >
                                        <Box marginRight={1}>
                                            <AnchorLinkIcon href={_.file} />
                                        </Box>
                                        <Box
                                            whiteSpace="nowrap"
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                            sx={filterLinkStyles}
                                            onClick={addErrorFilter}
                                        >
                                            {_.file}
                                        </Box>
                                    </Box>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                <Box sx={filterLinkStyles} onClick={addErrorFilter}>
                                    <b>L</b> {_.row} <b>C</b> {_.column}
                                </Box>
                            </TableCell>
                            <TableCell align="right">{_.user_count}</TableCell>
                            <TableCell align="right" width={130}>
                                <Box
                                    width={130}
                                    display="flex"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                >
                                    <Box>{_.event_count}</Box>
                                    <Box fontSize="8px" height={35} width={40} pt="3px" pl="10px">
                                        <CircularProgressWithLabel
                                            size={30}
                                            value={(_.event_count / totalErrors) * 100}
                                            forErrors
                                        />
                                    </Box>
                                </Box>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
