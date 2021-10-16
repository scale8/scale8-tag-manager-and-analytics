import { FC, Fragment } from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PlatformDataMapInput } from '../../types/DataMapsTypes';
import clsx from 'clsx';
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

const useStyles = makeStyles((theme) => ({
    line: {
        width: '100%',
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
    },
    border: {
        borderBottom: '1px solid #e0e0e0',
    },
    evenBg: {
        background: 'rgba(0, 0, 0, 0.03)',
    },
    children: {
        width: '100%',
        padding: theme.spacing(0, 1, 1, 1),
    },
    childrenBox: {
        margin: theme.spacing(1),
        border: '1px solid #e0e0e0',
        background: '#ffffff',
    },
    noElements: {
        width: '100%',
    },
}));

const TemplatedActionDataMapSection: FC<TemplatedActionDataMapSectionProps> = (
    props: TemplatedActionDataMapSectionProps,
) => {
    const classes = useStyles();

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
                <div className={classes.line}>
                    <Alert icon={false} color="info" className={classes.noElements}>
                        No Form Components Defined
                    </Alert>
                </div>
            ) : (
                currentDataMap.map((_: PlatformDataMapInput, index) => {
                    const hasChildren = _.type === 'Object' || _.type === 'Object Array';
                    const Icon = getPlatformDataMapIcon(_.type);
                    return (
                        <Fragment key={index}>
                            <div
                                key={index}
                                className={clsx(
                                    classes.line,
                                    hasChildren || classes.border,
                                    index % 2 !== 0 && classes.evenBg,
                                )}
                            >
                                <Box flexGrow={1} display="flex" alignItems="center">
                                    <Tooltip title={_.type}>
                                        <Box
                                            bgcolor={grey[300]}
                                            style={{
                                                padding: '3px',
                                                height: 30,
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
                            </div>
                            {hasChildren && (
                                <div
                                    className={clsx(
                                        classes.children,
                                        classes.border,
                                        index % 2 !== 0 && classes.evenBg,
                                    )}
                                >
                                    <b>Children:</b>
                                    <div className={classes.childrenBox}>
                                        <TemplatedActionDataMapSection
                                            addDataMap={addDataMap}
                                            deleteDataMap={deleteDataMap}
                                            updateDataMap={updateDataMap}
                                            inspectDataMap={inspectDataMap}
                                            parentsIndexes={[...parentsIndexes, index]}
                                            platformDataMaps={platformDataMaps}
                                            disabled={disabled}
                                        />
                                    </div>
                                </div>
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
