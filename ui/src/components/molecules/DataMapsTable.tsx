import { FC } from 'react';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { DataMapDefaultValue } from '../../types/DataMapsTypes';
import { InputType, VarType } from '../../gql/generated/globalTypes';
import DataMapsTableAddButton from '../atoms/DataMapsTableAddButton';
import { snakeToTitleCase } from '../../utils/TextUtils';
import { DataMapsRow } from './DataMapsRow';
import { getDefaultValueString } from '../../utils/DataMapUtils';

export type DataMapsTableRow = {
    id: string;
    key: string;
    varType: string;
    varTypeDisplay: string;
    defaultValue: string;
    isOptional: string;
    inputType: string | null;
    inputTypeDisplay: string;
    children: DataMapsTableRow[] | null;
};

export type DataMapsColumn = {
    title: string;
    field: keyof DataMapsTableRow;
};

export type SourceDataMap = {
    __typename: 'PlatformDataMap' | 'IngestEndpointDataMap';
    id: string;
    key: string;
    var_type: VarType;
    input_type?: InputType;
    is_optional: boolean;
    default_value: DataMapDefaultValue | null;
    child_platform_data_maps?: SourceDataMap[];
    child_ingest_endpoint_data_maps?: SourceDataMap[];
};

export type DataMapsTableProps = {
    isPlatform: boolean;
    tableData: DataMapsTableRow[];
    editable: boolean;
    contained: boolean;
    deleteHandler?: (dataMapId: string, dataMapName: string) => void;
    updateHandler?: (dataMapId: string) => void;
    inspectHandler?: (dataMapId: string) => void;
    createHandler?: (level: number, dataMapId?: string, dataMapName?: string) => void;
    parentId?: string;
    parentName?: string;
    level?: number;
};

const emptyTableBody = (columnsNumber: number) => (
    <TableBody>
        <TableRow>
            <TableCell align="center" colSpan={columnsNumber}>
                <Box padding={6}>No records to display</Box>
            </TableCell>
        </TableRow>
    </TableBody>
);

function dataMapToTableRow(sourceDataMap: SourceDataMap): DataMapsTableRow {
    const id = sourceDataMap.id;
    const isPlatform = sourceDataMap.__typename === 'PlatformDataMap';
    const key = sourceDataMap.key;
    const varType = sourceDataMap.var_type;
    const varTypeDisplay = snakeToTitleCase(varType);
    const inputType = sourceDataMap.input_type ?? null;
    const inputTypeDisplay = inputType !== null ? snakeToTitleCase(inputType) : '-';

    const isOptional = sourceDataMap.is_optional ? 'True' : 'False';

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const children = dataMapsToTableData(
        isPlatform
            ? sourceDataMap.child_platform_data_maps
            : sourceDataMap.child_ingest_endpoint_data_maps,
    );

    return {
        id,
        key,
        varType,
        varTypeDisplay,
        defaultValue: getDefaultValueString(sourceDataMap.default_value, sourceDataMap.var_type),
        isOptional,
        inputType,
        inputTypeDisplay,
        children,
    };
}

function dataMapsToTableData(sourceData?: SourceDataMap[]): DataMapsTableRow[] | null {
    if (sourceData === undefined) return null;
    return sourceData.map((_) => dataMapToTableRow(_));
}

const buildColumns = (isPlatform: boolean): DataMapsColumn[] => {
    return [
        ...[
            {
                title: 'Key',
                field: 'key',
            },
            {
                title: 'Var Type',
                field: 'varTypeDisplay',
            },
            {
                title: 'Default Value',
                field: 'defaultValue',
            },
            {
                title: 'Is Optional',
                field: 'isOptional',
            },
        ],
        ...(isPlatform
            ? [
                  {
                      title: 'Input Type',
                      field: 'inputTypeDisplay',
                  },
              ]
            : []),
    ] as DataMapsColumn[];
};

const DataMapsTable: FC<DataMapsTableProps> = (props: DataMapsTableProps) => {
    const {
        tableData,
        editable,
        contained,
        parentId,
        parentName,
        createHandler,
        deleteHandler,
        updateHandler,
        inspectHandler,
        isPlatform,
        level: initialLevel,
    } = props;

    const level = initialLevel === undefined ? 1 : initialLevel;

    const columns = buildColumns(isPlatform);

    return (
        <>
            <Box
                border={contained ? 1 : 0}
                borderBottom={0}
                borderColor="#e0e0e0"
                bgcolor="#ffffff"
            >
                <TableContainer>
                    <Table size="small" aria-label="data maps table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.field}>{column.title}</TableCell>
                                ))}
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        {tableData.length === 0 ? (
                            emptyTableBody(columns.length + (editable ? 1 : 0))
                        ) : (
                            <TableBody>
                                {tableData.map((row, index) => (
                                    <DataMapsRow
                                        index={index}
                                        key={row.id}
                                        row={row}
                                        columns={columns}
                                        editable={editable}
                                        deleteHandler={deleteHandler}
                                        createHandler={createHandler}
                                        updateHandler={updateHandler}
                                        inspectHandler={inspectHandler}
                                        isPlatform={isPlatform}
                                        level={level}
                                    />
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            </Box>
            {editable && (
                <Box mt={2} ml={contained ? 0 : 1}>
                    <DataMapsTableAddButton
                        text="Add Data Map"
                        onClick={() => {
                            createHandler && createHandler(level, parentId, parentName);
                        }}
                    />
                </Box>
            )}
        </>
    );
};

export { DataMapsTable, dataMapsToTableData };
