import { FC, Fragment } from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import { PlatformDataMapInput } from '../../types/DataMapsTypes';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { getCurrentDataMapInputFromParentsIndexes } from '../../utils/PlatformDataMapsUtils';
import { getPlatformDataMapIcon } from '../../utils/PlatformDataMapTypeUtils';
import { snakeToTitleCase } from '../../utils/TextUtils';
import { Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { grey } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useLoggedInState } from '../../context/AppContext';

export type TemplatedActionDataMapSectionProps = {
    addDataMap: (parentsIndexes: number[]) => void;
    deleteDataMap: (indexes: number[]) => void;
    updateDataMap: (indexes: number[]) => void;
    inspectDataMap: (indexes: number[]) => void;
    platformDataMaps: PlatformDataMapInput[];
    parentsIndexes: number[];
    disabled: boolean;
};

const TemplatedActionDataMapSection: FC<TemplatedActionDataMapSectionProps> = (
    props: TemplatedActionDataMapSectionProps,
) => {
    const {
        addDataMap,
        deleteDataMap,
        updateDataMap,
        inspectDataMap,
        platformDataMaps,
        parentsIndexes,
        disabled,
    } = props;

    const currentDataMap = getCurrentDataMapInputFromParentsIndexes(
        parentsIndexes,
        platformDataMaps,
    );

    const { templateInteractions } = useLoggedInState();
    const { dialogState } = templateInteractions;

    const secondaryDialogOpen = dialogState.secondaryPageComponent !== undefined;

    return (
        <>
            {currentDataMap.length === 0 ? (
                <Box
                    p={1}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Alert icon={false} color="info" sx={{ marginTop: 1, width: '100%' }}>
                        No Form Components Defined
                    </Alert>
                </Box>
            ) : (
                currentDataMap.map((_: PlatformDataMapInput, index) => {
                    const hasChildren = _.type === 'Object' || _.type === 'Object Array';
                    const Icon = getPlatformDataMapIcon(_.type);
                    return (
                        <Fragment key={index}>
                            <Box
                                p={1}
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderBottom: hasChildren ? '1px solid #e0e0e0' : undefined,
                                    background: index % 2 !== 0 ? 'rgba(0, 0, 0, 0.03)' : undefined,
                                }}
                                key={index}
                            >
                                <Box flexGrow={1} display="flex" alignItems="center">
                                    <Tooltip title={_.type}>
                                        <Box
                                            sx={{
                                                background: grey[300],
                                                padding: '3px',
                                                height: 25,
                                                overflow: 'hidden',
                                                marginRight: '8px',
                                                borderRadius: 5,
                                            }}
                                        >
                                            <Icon />
                                        </Box>
                                    </Tooltip>
                                    <Box component="span" fontSize={17}>
                                        <>
                                            {snakeToTitleCase(_.key)}
                                            {_.optional || '*'}
                                        </>
                                    </Box>
                                </Box>
                                {disabled ? (
                                    <>
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                inspectDataMap([...parentsIndexes, index]);
                                            }}
                                            disabled={secondaryDialogOpen}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                updateDataMap([...parentsIndexes, index]);
                                            }}
                                            disabled={secondaryDialogOpen}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                deleteDataMap([...parentsIndexes, index]);
                                            }}
                                            disabled={secondaryDialogOpen}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                            {hasChildren && (
                                <Box
                                    p={1}
                                    sx={{
                                        width: '100%',
                                        borderBottom: '1px solid #e0e0e0',
                                        background:
                                            index % 2 !== 0 ? 'rgba(0, 0, 0, 0.03)' : undefined,
                                    }}
                                >
                                    <b>Children:</b>
                                    <Box
                                        m={1}
                                        sx={{
                                            border: '1px solid #e0e0e0',
                                            background: '#ffffff',
                                        }}
                                    >
                                        <TemplatedActionDataMapSection
                                            addDataMap={addDataMap}
                                            deleteDataMap={deleteDataMap}
                                            updateDataMap={updateDataMap}
                                            inspectDataMap={inspectDataMap}
                                            parentsIndexes={[...parentsIndexes, index]}
                                            platformDataMaps={platformDataMaps}
                                            disabled={disabled}
                                        />
                                    </Box>
                                </Box>
                            )}
                        </Fragment>
                    );
                })
            )}
            <Box p={1}>
                {!disabled && (
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => addDataMap(parentsIndexes)}
                        startIcon={<AddIcon />}
                        disabled={secondaryDialogOpen}
                    >
                        Add Form Component
                    </Button>
                )}
            </Box>
        </>
    );
};

export default TemplatedActionDataMapSection;
