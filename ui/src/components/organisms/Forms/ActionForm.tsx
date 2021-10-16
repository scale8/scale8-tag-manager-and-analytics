import { FC, useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, useTheme } from '@mui/material';
import { MappedPlatformValuesForm } from '../../molecules/MappedPlatformValues/MappedPlatformValuesForm';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import ControlledFilteredSelects from '../../atoms/ControlledInputs/ControlledFilteredSelects';
import { SelectValueWithSub } from '../../../hooks/form/useFormValidation';
import { controlledSelectValuesFindByInnerKey } from '../../../utils/ControlledSelectUtils';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { ActionFormProps, ActionValues } from '../../../types/props/forms/ActionFormProps';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';
import { buildActionName } from '../../../dialogPages/tagManager/app/action/ActionUpdate';

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
    const theme = useTheme();

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
                <ControlledFilteredSelects
                    disabled={!!props.update}
                    className="DrawerFormField"
                    label="Action"
                    name="platformActionId"
                    initialFilterValue={props.initialPlatformId}
                    values={props.platformActions}
                    formProps={props}
                    required
                    filterLabel="Platform"
                    missingSubMessage="There are no actions available in this platform."
                    hideNoSub
                />
            )}
            <small style={{ width: '100%', margin: theme.spacing(0, 0, 2) }}>
                {getDescription(values, props.platformActions)}
            </small>
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
                            style={{ marginBottom: theme.spacing(3) }}
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
                        {!generateName && (
                            <ControlledTextInput
                                name="name"
                                label="Name"
                                formProps={props}
                                className="DrawerFormField"
                                required
                            />
                        )}
                    </>
                )}
            <ControlledTextAreaInput
                name="comments"
                label="Comments"
                formProps={props}
                className="DrawerFormField"
            />
        </DrawerFormLayout>
    );
};

export default ActionForm;
