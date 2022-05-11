import { FC, useEffect, useState } from 'react';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { Checkbox, FormControlLabel } from '@mui/material';
import { RuleFormProps, RuleValues } from '../../../dialogPages/tagManager/app/tag/RuleCreate';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormPositiveInput } from '../../atoms/DialogFormInputs/DialogFormPositiveInput';
import { DialogFormSelect } from '../../atoms/DialogFormInputs/DialogFormSelect';

const RuleForm: FC<RuleFormProps> = (props: RuleFormProps) => {
    const { values, availableGlobalTriggers, handleChange } = props;

    const [useGlobalTrigger, setUseGlobalTrigger] = useState(false);

    useEffect(() => {
        if (!useGlobalTrigger && values.globalTriggerId !== '') {
            handleChange('globalTriggerId', '');
        }
    }, [values, useGlobalTrigger, handleChange]);

    return (
        <DialogFormContextProvider<RuleValues> formProps={props}>
            <DrawerFormLayout
                submitDisable={
                    props.isSubmitting ||
                    (availableGlobalTriggers !== undefined &&
                        useGlobalTrigger &&
                        availableGlobalTriggers.length === 0)
                }
                {...props}
            >
                <DialogFormTextInput name="name" label="Name" autoFocus />
                {availableGlobalTriggers !== undefined && (
                    <>
                        <FormControlLabel
                            sx={{ marginBottom: (theme) => theme.spacing(3) }}
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
                                <DialogFormSelect
                                    label="Global Trigger"
                                    name="globalTriggerId"
                                    values={availableGlobalTriggers}
                                />
                            ))}
                    </>
                )}
                <FormControlLabel
                    sx={{ marginBottom: (theme) => theme.spacing(3) }}
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
                    <DialogFormPositiveInput
                        name="minRepeatInterval"
                        label="Minimum time in seconds before rule can repeat"
                        max="1200"
                    />
                )}
                <DialogFormTextAreaInput name="comments" label="Comments" optional />
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default RuleForm;
