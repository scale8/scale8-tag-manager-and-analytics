import { FC } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Theme } from '@mui/material';
import {
    AppChartBaseData_getApp_environments,
    AppChartBaseData_getApp_revisions,
} from '../../gql/generated/AppChartBaseData';
import { SxProps } from '@mui/system';

export const ChartBaseFilterSelectorContent: FC<{
    loadedEnvironments: AppChartBaseData_getApp_environments[];
    currentEnvironmentKey: string;
    handleEnvironmentChange: (e: SelectChangeEvent) => void;
    loadedRevisions: AppChartBaseData_getApp_revisions[];
    currentRevisionKey: string;
    handleRevisionChange: (e: SelectChangeEvent) => void;
}> = ({
    loadedEnvironments,
    currentEnvironmentKey,
    handleEnvironmentChange,
    loadedRevisions,
    currentRevisionKey,
    handleRevisionChange,
}) => {
    const selectRoot: SxProps<Theme> = {
        '&:focus': {
            backgroundColor: '#ffffff',
        },
        width: '200px',
    };

    const selectContainer: SxProps<Theme> = {
        marginRight: 2,
        marginBottom: 1,
    };

    return (
        <>
            <FormControl variant="outlined" size="small" sx={selectContainer}>
                <InputLabel id="environment-label">Environment</InputLabel>
                <Select
                    labelId="environment-label"
                    sx={selectRoot}
                    value={currentEnvironmentKey}
                    onChange={handleEnvironmentChange}
                    label="Environment"
                >
                    <MenuItem value={' '}>All Environments</MenuItem>
                    {loadedEnvironments.map((environment) => (
                        <MenuItem key={environment.id} value={environment.id}>
                            {environment.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" sx={selectContainer}>
                <InputLabel id="revision-label">Revision</InputLabel>
                <Select
                    labelId="revision-label"
                    sx={selectRoot}
                    value={currentRevisionKey}
                    onChange={handleRevisionChange}
                    label="Revision"
                >
                    <MenuItem value={' '}>All Revisions</MenuItem>
                    {loadedRevisions.map((revision) => (
                        <MenuItem key={revision.id} value={revision.id}>
                            {revision.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
};
