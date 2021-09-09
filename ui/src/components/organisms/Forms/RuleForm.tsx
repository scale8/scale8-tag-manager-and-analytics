import { FC, useEffect, useState } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';
import PositiveInRangeInput from '../../atoms/InputTypes/PositiveInRangeInput';
import { RuleFormProps } from '../../../dialogPages/tagManager/app/tag/RuleCreate';

const RuleForm: FC<RuleFormProps> = (props: RuleFormProps) => {
    const theme = useTheme();

    const { values, availableGlobalTriggers, handleChange } = props;

    const [useGlobalTrigger, setUseGlobalTrigger] = useState(false);

    useEffect(() => {
        if (!useGlobalTrigger && values.globalTriggerId !== '') {
            handleChange('globalTriggerId', '');
        }
    }, [values, useGlobalTrigger, handleChange]);

    return (
        <DrawerFormLayout
            submitDisable={
                props.isSubmitting ||
                (availableGlobalTriggers !== undefined &&
                    useGlobalTrigger &&
                    availableGlobalTriggers.length === 0)
            }
            {...props}
        >
            <ControlledTextInput
                name="name"
                label="Name"
                formProps={props}
                className="DrawerFormField"
                required
                autoFocus
            />
            {availableGlobalTriggers !== undefined && (
                <>
                    <FormControlLabel
                        style={{ marginBottom: theme.spacing(3) }}
                        control={
                            <Checkbox
                                name="useGlobalTrigger"
                                checked={useGlobalTrigger}
                                onChange={(event) => {
                                    setUseGlobalTrigger(event.target.checked);
                                }}
                                color="primary"
                            />
                        }
                        label="Use Global Trigger"
                    />
                    {useGlobalTrigger &&
                        (availableGlobalTriggers.length === 0 ? (
                            <small>There are no global triggers available.</small>
                        ) : (
                            <ControlledSelect
                                className="DrawerFormField"
                                label="Global Trigger"
                                name="globalTriggerId"
                                values={availableGlobalTriggers}
                                formProps={props}
                                required
                            />
                        ))}
                </>
            )}
            <FormControlLabel
                style={{ marginBottom: theme.spacing(3) }}
                control={
                    <Checkbox
                        name="repeatable"
                        checked={values.minRepeatInterval > -1}
                        onChange={(event) => {
                            handleChange('minRepeatInterval', event.target.checked ? 0 : -1);
                        }}
                        color="primary"
                    />
                }
                label="Repeatable"
            />
            {values.minRepeatInterval > -1 && (
                <PositiveInRangeInput
                    name="minRepeatInterval"
                    label="Minimum time in seconds before rule can repeat"
                    value={values.minRepeatInterval}
                    setValue={(v: number | '') => handleChange('minRepeatInterval', v)}
                    validationError={props.errors.minRepeatInterval}
                    onBlur={props.handleBlur}
                    max="1200"
                    className="DrawerFormField"
                />
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

export default RuleForm;
