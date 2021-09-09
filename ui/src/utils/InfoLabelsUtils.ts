import { Column, ColumnBuilderBase, RowData } from '../components/molecules/S8Table/S8TableTypes';
import { camelToTitleCase, ucFirst } from './TextUtils';
import { InfoProps } from '../components/molecules/InfoButton';

const buildInfoProps = <T extends RowData>(
    infoKeyBase: string,
    column: ColumnBuilderBase<T>,
): InfoProps => ({
    side: column.columnInfoSide ?? 'right',
    id: column.columnInfoId ?? `${infoKeyBase}Column${ucFirst(column.field.toString())}`,
});

const buildStandardMainInfo = (infoKeyBase: string): InfoProps => ({
    side: 'right',
    id: `${infoKeyBase}Main`,
});

const buildStandardFormInfo = (infoKeyBase: string, verb: string): InfoProps => ({
    side: 'left',
    id: `${infoKeyBase}${verb}`,
});

const buildTableColumns = <T extends RowData>(
    infoKeyBase: string,
    columns: ColumnBuilderBase<T>[],
): Column<T>[] =>
    columns.map((column) => {
        if (column.field === 'id') {
            return {
                field: column.field,
                title: column.title ?? 'Id',
                columnInfoProps: buildInfoProps<T>(infoKeyBase, column),
                type: column.type ?? 'string',
                hidden: column.hidden ?? true,
            };
        }
        if (column.field === 'updatedAt') {
            return {
                field: column.field,
                title: column.title ?? 'Last Update',
                columnInfoProps: buildInfoProps<T>(infoKeyBase, column),
                type: column.type ?? 'datetime',
                hidden: column.hidden ?? true,
            };
        }
        if (column.field === 'createdAt') {
            return {
                field: column.field,
                title: column.title ?? 'Created on',
                columnInfoProps: buildInfoProps<T>(infoKeyBase, column),
                type: column.type ?? 'datetime',
                hidden: column.hidden,
            };
        }
        return {
            field: column.field,
            title: column.title ?? camelToTitleCase(column.field.toString()),
            columnInfoProps: {
                side: column.columnInfoSide ?? 'right',
                id:
                    column.columnInfoId ??
                    `${infoKeyBase}Column${ucFirst(column.field.toString())}`,
            },
            type: column.type ?? 'string',
            hidden: column.hidden,
        };
    });

export { buildTableColumns, buildStandardMainInfo, buildStandardFormInfo };
