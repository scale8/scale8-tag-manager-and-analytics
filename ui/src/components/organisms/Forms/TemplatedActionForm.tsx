import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Badge, BadgeProps, Box, Button, Divider, lighten } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabsTabPanel from '../../molecules/TabsTabPanel';
import { MainDrawerTitle } from '../../molecules/MainDrawerTitle';
import { InfoButton } from '../../molecules/InfoButton';
import { TemplatedActionFormProps } from '../../../types/props/forms/TemplatedActionFormProps';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';
import TemplatedActionDataMapSection from '../TemplatedActionDataMapSection';
import TemplatedActionDataMapFormPreview from '../TemplatedActionDataMapFormPreview';
import TemplatedActionPayloadSample from '../TemplatedActionPayloadSample';
import TemplatedActionCodeInput from '../TemplatedActionCodeInput';
import TemplatedActionPermissions from '../TemplatedActionPermissions';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { getSelectValuesForTypeIcons } from '../../../utils/TypeIconsUtils';
import CheckBoxInput from '../../atoms/InputTypes/CheckBoxInput';
import { useLoggedInState } from '../../../context/AppContext';
import { triggerUpdateTemplatedActionDataMap } from '../../../dialogPages/tagManager/platform/TemplatedActionDataMapUpdate';
import { deleteTemplatedActionDataMap } from '../../../dialogPages/tagManager/platform/TemplatedActionDataMapDelete';
import { triggerAddTemplatedActionDataMap } from '../../../dialogPages/tagManager/platform/TemplatedActionDataMapCreate';
import { styled } from '@mui/material/styles';

const TemplatedActionForm: FC<TemplatedActionFormProps> = (props: TemplatedActionFormProps) => {
    const { gqlError, errors } = props;

    const { templateInteractions } = useLoggedInState();
    const { setSnackbarError, dispatchDialogAction } = templateInteractions;

    useEffect(() => {
        if (gqlError) {
            setSnackbarError(gqlError);
        }
    }, [gqlError, setSnackbarError]);

    const tabErrors: {
        code: boolean;
        dataMaps: boolean;
        info: boolean;
        permissions: boolean;
    } = {
        info:
            errors.name !== undefined ||
            errors.description !== undefined ||
            errors.icon !== undefined,
        dataMaps: false,
        code: errors.code !== undefined,
        permissions: errors.permissionRequests !== undefined,
    };

    const [tabIndex, setTabIndex] = useState(0);

    const [permissionInfoOpen, setPermissionInfoOpen] = useState(true);

    const handleTabIndexChange = (event: ChangeEvent<unknown>, newValue: number) => {
        setTabIndex(newValue);
    };

    const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: -17,
            top: 7,
            backgroundColor: theme.palette.error.main,
        },
    }));

    return (
        <Box
            component="form"
            sx={{
                '& .DialogFormField': {
                    width: '100%',
                    margin: (theme) => theme.spacing(0, 0, 3),
                },
                minHeight: '100vh',
                display: 'flex',
                flexFlow: 'column nowrap',
            }}
            onSubmit={props.handleSubmit}
        >
            <MainDrawerTitle handleDialogClose={props.handleDialogClose}>
                <Box flexGrow={1}>
                    {props.title}
                    {props.formInfoProps !== undefined && <InfoButton {...props.formInfoProps} />}
                </Box>
                {!props.readOnly && (
                    <Box>
                        <Button
                            size="small"
                            type="submit"
                            sx={{
                                marginRight: (theme) => theme.spacing(2),
                                color: (theme) =>
                                    theme.palette.getContrastText(theme.palette.info.main),
                                backgroundColor: (theme) => theme.palette.info.main,
                                '&:hover': {
                                    backgroundColor: (theme) =>
                                        lighten(theme.palette.info.main, 0.4),
                                },
                            }}
                            disabled={props.isSubmitting}
                        >
                            Save
                        </Button>
                    </Box>
                )}
            </MainDrawerTitle>
            <AppBar position="static" color="default" elevation={0}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabIndexChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab
                        label={
                            <StyledBadge
                                badgeContent={tabErrors.info ? '!' : undefined}
                                color="secondary"
                            >
                                Info
                            </StyledBadge>
                        }
                        wrapped
                    />
                    <Tab
                        label={
                            <StyledBadge
                                badgeContent={tabErrors.dataMaps ? '!' : undefined}
                                color="secondary"
                            >
                                Form
                            </StyledBadge>
                        }
                        wrapped
                    />
                    <Tab
                        label={
                            <StyledBadge
                                badgeContent={tabErrors.code ? '!' : undefined}
                                color="secondary"
                            >
                                Code
                            </StyledBadge>
                        }
                        wrapped
                    />
                    {!props.values.execRaw && (
                        <Tab
                            label={
                                <StyledBadge
                                    badgeContent={tabErrors.permissions ? '!' : undefined}
                                    color="secondary"
                                >
                                    Permissions
                                </StyledBadge>
                            }
                            wrapped
                        />
                    )}
                </Tabs>
            </AppBar>
            <Divider />
            <Box flex={1} position="relative">
                <Box height="100%" position="absolute" width="100%">
                    <TabsTabPanel value={tabIndex} index={0}>
                        <Box p={3}>
                            <ControlledTextInput
                                name="name"
                                label="Name"
                                formProps={props}
                                className="DialogFormField"
                                disabled={props.readOnly}
                                requiredOnValidation
                            />
                            <ControlledTextAreaInput
                                name="description"
                                label="Description"
                                formProps={props}
                                className="DialogFormField"
                                disabled={props.readOnly}
                                requiredOnValidation
                            />
                            <ControlledSelect
                                className="DialogFormField"
                                label="Icon"
                                name="icon"
                                values={getSelectValuesForTypeIcons('Action')}
                                formProps={props}
                                disabled={props.readOnly}
                                requiredOnValidation
                            />
                            {props.userIsAdmin && (
                                <CheckBoxInput
                                    label="Execute Raw In iFrame"
                                    name="execRaw"
                                    value={props.values['execRaw']}
                                    disabled={props.readOnly || props.isEdit}
                                    setValue={(v) => props.handleChange('execRaw', v)}
                                    className="DialogFormField"
                                />
                            )}
                        </Box>
                    </TabsTabPanel>
                    <TabsTabPanel value={tabIndex} index={1} fullHeight>
                        <Box display="flex" flexDirection="column" flexWrap="nowrap" height="100%">
                            <Box flex="0 0 50%" height="50%" width="100%" overflow="auto" pb={2}>
                                <TemplatedActionDataMapSection
                                    addDataMap={(parentsIndexes: number[]) => {
                                        triggerAddTemplatedActionDataMap(
                                            parentsIndexes,
                                            props.values.platformDataMaps,
                                            props.handleChange,
                                            dispatchDialogAction,
                                        );
                                    }}
                                    deleteDataMap={(indexes) => {
                                        deleteTemplatedActionDataMap(
                                            indexes,
                                            props.values.platformDataMaps,
                                            props.handleChange,
                                        );
                                    }}
                                    updateDataMap={(indexes: number[]) => {
                                        triggerUpdateTemplatedActionDataMap(
                                            indexes,
                                            props.values.platformDataMaps,
                                            props.handleChange,
                                            dispatchDialogAction,
                                            false,
                                        );
                                    }}
                                    inspectDataMap={(indexes: number[]) => {
                                        triggerUpdateTemplatedActionDataMap(
                                            indexes,
                                            props.values.platformDataMaps,
                                            props.handleChange,
                                            dispatchDialogAction,
                                            true,
                                        );
                                    }}
                                    platformDataMaps={props.values.platformDataMaps}
                                    parentsIndexes={[]}
                                    disabled={props.readOnly}
                                />
                            </Box>
                            <Divider />
                            <Box
                                sx={{
                                    background: `url('/img/pattern.png')`,
                                    padding: (theme) => theme.spacing(1, 2, 1, 2),
                                    fontSize: 24,
                                }}
                            >
                                Form Preview
                            </Box>
                            <Divider />
                            <Box flex="1" height="50%" width="100%" overflow="auto">
                                <Box>
                                    <TemplatedActionDataMapFormPreview
                                        platformDataMaps={props.values.platformDataMaps}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </TabsTabPanel>
                    <TabsTabPanel value={tabIndex} index={2} fullHeight>
                        <Box display="flex" flexDirection="column" flexWrap="nowrap" height="100%">
                            <Box flex="0 0 50%" width="100%">
                                <TemplatedActionPayloadSample
                                    platformDataMaps={props.values.platformDataMaps}
                                />
                            </Box>
                            <Box flex="0 0 50%" width="100%" p={2}>
                                <TemplatedActionCodeInput {...props} />
                            </Box>
                        </Box>
                    </TabsTabPanel>
                    <TabsTabPanel value={tabIndex} index={3}>
                        <TemplatedActionPermissions
                            {...props}
                            permissionInfoOpen={permissionInfoOpen}
                            setPermissionInfoOpen={setPermissionInfoOpen}
                        />
                    </TabsTabPanel>
                </Box>
            </Box>
        </Box>
    );
};

export default TemplatedActionForm;
