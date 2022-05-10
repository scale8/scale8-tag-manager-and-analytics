import { FC, useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { MappedPlatformValuesForm } from '../../molecules/MappedPlatformValues/MappedPlatformValuesForm';
import { SelectValueWithSub } from '../../../hooks/form/useFormValidation';
import { controlledSelectValuesFindByInnerKey } from '../../../utils/ControlledSelectUtils';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { ActionFormProps, ActionValues } from '../../../types/props/forms/ActionFormProps';
import { buildActionName } from '../../../dialogPages/tagManager/app/action/ActionUpdate';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';
import { DialogFormFilteredSelects } from '../../atoms/DialogFormInputs/DialogFormFilteredSelects';

const getDescription = (values: ActionValues, platformActions: SelectValueWithSub[]): string => {
    if (!values.platformActionId) {
        return '';
    }

    const selectedAction = controlledSelectValuesFindByInnerKey(
        platformActions,
        values.platformActionId,
    );

    return selectedAction?.description ?? '';
};

const ActionForm: FC<ActionFormProps> = (props: ActionFormProps) => {
    const noPlatformActions = props.platformActions.length < 1;

    const [generateName, setGenerateName] = useState(
        props.generateName === undefined ? true : props.generateName,
    );

    const { values, platformActions, handleChange } = props;

    useEffect(() => {
        const currentName = buildActionName(values.platformActionId, platformActions);

        if (values.platformActionId !== '' && generateName && values.name !== currentName) {
            handleChange('name', currentName);
        }
    }, [values, platformActions, handleChange, generateName]);

    return (
        <DialogFormContextProvider<ActionValues> formProps={props}>
            <DrawerFormLayout
                {...props}
                submitDisable={
                    props.isSubmitting ||
                    noPlatformActions ||
                    props.values.mappedPlatformValues === undefined
                }
            >
                {noPlatformActions ? (
                    <small>There are no platforms with actions available.</small>
                ) : (
                    <DialogFormFilteredSelects
                        name="platformActionId"
                        label="Action"
                        initialFilterValue={props.initialPlatformId}
                        values={props.platformActions}
                        filterLabel="Platform"
                        missingSubMessage="There are no actions available in this platform."
                        disabled={!!props.update}
                    />
                )}
                <Box
                    component="small"
                    sx={{ width: '100%', margin: (theme) => theme.spacing(0, 0, 2) }}
                >
                    {getDescription(values, props.platformActions)}
                </Box>
                {props.values.mappedPlatformValues !== undefined &&
                    props.values.platformActionId !== '' && (
                        <>
                            <MappedPlatformValuesForm
                                appPlatformRevisions={props.appPlatformRevisions}
                                mappedPlatformValues={props.values.mappedPlatformValues}
                                parentLocators={[]}
                                {...props}
                            />
                            <FormControlLabel
                                sx={{ marginBottom: (theme) => theme.spacing(3) }}
                                control={
                                    <Checkbox
                                        name="generateName"
                                        checked={generateName}
                                        onChange={(event) => {
                                            setGenerateName(event.target.checked);
                                        }}
                                        color="primary"
                                    />
                                }
                                label="Generate Name"
                            />
                            {!generateName && <DialogFormTextInput name="name" label="Name" />}
                        </>
                    )}
                <DialogFormTextAreaInput name="comments" label="Comments" optional />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default ActionForm;
