import { FC } from 'react';
import { Box, Checkbox, IconButton } from '@mui/material';
import { VarType } from '../../gql/generated/globalTypes';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { DataMapsPayloadValues } from '../../types/DataMapsTypes';
import { AppPlatformRevision } from '../../types/TagRulesTypes';
import { DataMapsValueEdit } from './DataMapsValueEdit';
import { getDefaultValueString } from '../../utils/DataMapUtils';
import { snakeToTitleCase } from '../../utils/TextUtils';

export type DataMapsTabularEditSetters = {
    removeObjectArrayElement: (keyPath: string, index: number) => void;
    addObjectArrayElement: (keyPath: string) => void;
    removeArrayElement: (keyPath: string, index: number) => void;
    addArrayElement: (keyPath: string) => void;
    setValue: (keyPath: string, v: S8DataMapValue, index: number) => void;
    setInclude: (keyPath: string, include: boolean) => void;
};

export type DataMapsPayloadValuesRowProps = DataMapsTabularEditSetters & {
    dataMapsPayloadValues: DataMapsPayloadValues;
    appPlatformRevisions?: AppPlatformRevision[];
    disabled: boolean;
};

const DataMapsPayloadValuesScalarRow: FC<DataMapsPayloadValuesRowProps> = (
    props: DataMapsPayloadValuesRowProps,
) => {
    const { disabled, dataMapsPayloadValues: v, appPlatformRevisions, ...s } = props;

    return (
        <tr>
            <Box
                component="td"
                colSpan={3}
                sx={{
                    paddingLeft: 0,
                }}
            >
                <Box display="flex" alignItems="center">
                    <Checkbox
                        sx={{ marginTop: '2px' }}
                        checked={v.include}
                        onChange={(event) => {
                            s.setInclude(v.keyPath, event.target.checked);
                        }}
                        color="primary"
                        inputProps={{
                            'aria-label': 'include',
                        }}
                        disabled={
                            disabled || (v.dataMap.default_value === null && !v.dataMap.is_optional)
                        }
                    />
                    <Box display="flex" flexDirection="column" py={1}>
                        <Box sx={{ wordBreak: 'break-all' }}>{v.keyPath}</Box>
                        <Box fontStyle="italic" color="#666666" fontSize="13px">
                            ({snakeToTitleCase(v.dataMap.var_type)})
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                component="td"
                className="inputCell"
                sx={{
                    background: v.include ? 'transparent' : '#f9f9f9',
                }}
            >
                {v.include ? (
                    <DataMapsValueEdit
                        dataMapsPayloadValues={v}
                        addArrayElement={s.addArrayElement}
                        removeArrayElement={s.removeArrayElement}
                        setValue={s.setValue}
                        appPlatformRevisions={appPlatformRevisions}
                        disabled={disabled}
                    />
                ) : (
                    <Box color="#bbbbbb">
                        <>
                            {v.dataMap.default_value === null ? (
                                <>Exclude</>
                            ) : (
                                <>
                                    Use Default: <br />
                                    <Box color="#777777" component="span">
                                        {getDefaultValueString(
                                            v.dataMap.default_value,
                                            v.dataMap.var_type,
                                        )}
                                    </Box>
                                </>
                            )}
                        </>
                    </Box>
                )}
            </Box>
        </tr>
    );
};

const DataMapsPayloadValuesObjectRow: FC<DataMapsPayloadValuesRowProps> = (
    props: DataMapsPayloadValuesRowProps,
) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { disabled, dataMapsPayloadValues: v, appPlatformRevisions, ...s } = props;

    return (
        <tr>
            <Box
                component="td"
                colSpan={4}
                sx={{
                    background: v.include ? '#eeeeee' : '#f9f9f9',
                    padding: '0!important',
                    borderRight: '0!important',
                }}
            >
                <Box display="flex" alignItems="center">
                    <Checkbox
                        sx={{ marginTop: '2px' }}
                        checked={v.include}
                        onChange={(event) => {
                            s.setInclude(v.keyPath, event.target.checked);
                        }}
                        color="primary"
                        inputProps={{
                            'aria-label': 'include',
                        }}
                        disabled={disabled || !v.dataMap.is_optional}
                    />
                    {v.keyPath}
                </Box>
            </Box>
        </tr>
    );
};

const DataMapsPayloadValuesObjectContentRow: FC<DataMapsPayloadValuesRowProps> = (
    props: DataMapsPayloadValuesRowProps,
) => {
    const { disabled, dataMapsPayloadValues: v, appPlatformRevisions, ...s } = props;

    if (!v.include || v.objects[0].children.length === 0) return null;

    return (
        <tr>
            <td className="objectSpacer" />
            <Box
                component="td"
                colSpan={3}
                sx={{
                    padding: '0!important',
                    margin: '0!important',
                    borderTop: '0!important',
                }}
            >
                <Box
                    component="table"
                    sx={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%' }}
                >
                    <tbody>
                        {v.objects.map((object) =>
                            object.children.map((dataMapsPayloadValues: DataMapsPayloadValues) => (
                                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                                <DataMapsPayloadValuesRow
                                    key={dataMapsPayloadValues.keyPath}
                                    dataMapsPayloadValues={dataMapsPayloadValues}
                                    disabled={disabled}
                                    appPlatformRevisions={appPlatformRevisions}
                                    {...s}
                                />
                            )),
                        )}
                    </tbody>
                </Box>
            </Box>
        </tr>
    );
};

const DataMapsPayloadValuesObjectArrayRows: FC<DataMapsPayloadValuesRowProps> = (
    props: DataMapsPayloadValuesRowProps,
) => {
    const { disabled, dataMapsPayloadValues: v, appPlatformRevisions, ...s } = props;

    if (!v.include) return null;

    return (
        <>
            {v.objects.map((object, index) => (
                <tr key={index}>
                    <td className="objectSpacer" />
                    <td className="arraySpacer">
                        {v.objects.length > 1 && !disabled && (
                            <IconButton
                                aria-label="delete"
                                onClick={() => {
                                    s.removeObjectArrayElement(v.keyPath, index);
                                }}
                                size="small"
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        )}
                    </td>
                    <Box
                        component="td"
                        colSpan={2}
                        sx={{
                            padding: '0!important',
                            margin: '0!important',
                            borderTop: '0!important',
                        }}
                    >
                        <Box
                            component="table"
                            sx={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%' }}
                        >
                            <tbody>
                                {object.children.map(
                                    (dataMapsPayloadValues: DataMapsPayloadValues) => (
                                        // eslint-disable-next-line @typescript-eslint/no-use-before-define
                                        <DataMapsPayloadValuesRow
                                            key={dataMapsPayloadValues.keyPath}
                                            dataMapsPayloadValues={dataMapsPayloadValues}
                                            disabled={disabled}
                                            appPlatformRevisions={appPlatformRevisions}
                                            {...s}
                                        />
                                    ),
                                )}
                            </tbody>
                        </Box>
                    </Box>
                </tr>
            ))}
        </>
    );
};

const DataMapsPayloadValuesArrayAddRow: FC<DataMapsPayloadValuesRowProps> = (
    props: DataMapsPayloadValuesRowProps,
) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { disabled, dataMapsPayloadValues: v, ...s } = props;

    if (!v.include) return null;

    return (
        <tr>
            <td className="objectSpacer" />
            <Box
                component="td"
                colSpan={3}
                sx={{
                    padding: '0!important',
                    borderRight: '0!important',
                }}
            >
                <IconButton
                    sx={{
                        marginLeft: '5px',
                    }}
                    aria-label="add"
                    onClick={() => {
                        s.addObjectArrayElement(v.keyPath);
                    }}
                    size="small"
                >
                    <AddIcon fontSize="small" />
                </IconButton>
            </Box>
        </tr>
    );
};

const DataMapsPayloadValuesRow: FC<DataMapsPayloadValuesRowProps> = (
    props: DataMapsPayloadValuesRowProps,
) => {
    const { disabled, dataMapsPayloadValues: v } = props;

    if (v.dataMap.var_type === VarType.OBJECT) {
        return (
            <>
                <DataMapsPayloadValuesObjectRow {...props} />
                <DataMapsPayloadValuesObjectContentRow {...props} />
            </>
        );
    }

    if (v.dataMap.var_type === VarType.ARRAY_OBJECT) {
        return (
            <>
                <DataMapsPayloadValuesObjectRow {...props} />
                <DataMapsPayloadValuesObjectArrayRows {...props} />
                {!disabled && <DataMapsPayloadValuesArrayAddRow {...props} />}
            </>
        );
    }

    return <DataMapsPayloadValuesScalarRow {...props} />;
};

export type DataMapsTabularEditProps = DataMapsTabularEditSetters & {
    dataMapsPayloadValues: DataMapsPayloadValues[];
    appPlatformRevisions?: AppPlatformRevision[];
    disabled: boolean;
};

const DataMapsTabularEdit: FC<DataMapsTabularEditProps> = (props: DataMapsTabularEditProps) => {
    const { disabled, dataMapsPayloadValues: v, ...s } = props;

    return (
        <Box
            component="table"
            sx={{
                width: '100%',
                margin: (theme) => theme.spacing(2, 0),
                border: '1px solid #dddddd',
                borderCollapse: 'separate',
                borderSpacing: 0,
                '& td, & th': {
                    textAlign: 'left',
                },
                '& th': {
                    padding: (theme) => theme.spacing(1),
                },
                '& td': {
                    padding: (theme) => theme.spacing(0, 1),
                    borderTop: '1px solid #dddddd',
                },
                '& th:first-of-type, & td:first-of-type': {
                    borderRight: '1px solid #dddddd',
                },
                '& td.objectSpacer': {
                    padding: 0,
                    borderTop: 0,
                    width: '20px',
                    background: '#eeeeee',
                },
                '& td.arraySpacer': {
                    padding: 0,
                    background: '#ffffff',
                    borderTop: '1px solid #dddddd',
                    borderRight: '1px solid #dddddd',
                    width: '30px',
                    verticalAlign: 'top',
                },
                '& td.inputCell': {
                    width: '40%',
                },
            }}
        >
            <thead>
                <tr>
                    <th colSpan={3}>Key</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {v.map((dataMapsPayloadValues: DataMapsPayloadValues) => (
                    <DataMapsPayloadValuesRow
                        key={dataMapsPayloadValues.keyPath}
                        dataMapsPayloadValues={dataMapsPayloadValues}
                        disabled={disabled}
                        {...s}
                    />
                ))}
            </tbody>
        </Box>
    );
};

export { DataMapsTabularEdit };
