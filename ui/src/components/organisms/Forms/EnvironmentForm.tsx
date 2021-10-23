import { FC, useState } from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import ControlledSelect from '../../atoms/ControlledInputs/ControlledSelect';
import EnvironmentVariablesInput from '../../atoms/EnvironmentVariablesInput';
import ControlledTextAreaInput from '../../atoms/ControlledInputs/ControlledTextAreaInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { EnvironmentFormProps } from '../../../dialogPages/tagManager/app/EnvironmentCreate';

const EnvironmentForm: FC<EnvironmentFormProps> = (props: EnvironmentFormProps) => {
    const [customDomain, setCustomDomain] = useState(
        (props.gqlError?.message ?? '').indexOf('Certificate') !== -1,
    );

    return (
        <DrawerFormLayout {...props}>
            <ControlledTextInput
                name="name"
                label="Name"
                formProps={props}
                className="DrawerFormField"
                required
                autoFocus
            />

            <ControlledTextInput
                name="url"
                label="URL"
                formProps={props}
                className="DrawerFormField"
            />

            {props.availableRevisions.length < 1 && (
                <small>
                    At least one revision needs to be finalised for it to be attached to an
                    environment.
                </small>
            )}

            <ControlledSelect
                className="DrawerFormField"
                label="Revision"
                name="revisionId"
                values={props.availableRevisions}
                formProps={props}
                disabled={props.availableRevisions.length < 1}
                required
            />

            {props.hasCustomDomain === undefined && (
                <FormControlLabel
                    sx={{
                        marginBottom: (theme) => theme.spacing(1),
                    }}
                    control={
                        <Checkbox
                            name="customDomain"
                            checked={customDomain}
                            onChange={(event) => {
                                if (!event.target.checked) {
                                    props.handleChange('domain', '');
                                }
                                setCustomDomain(event.target.checked);
                            }}
                            color="primary"
                        />
                    }
                    label="Custom Domain"
                />
            )}

            {customDomain && (
                <ControlledTextInput
                    name="domain"
                    label="Domain"
                    formProps={props}
                    className="DrawerFormField"
                    required
                />
            )}

            {(props.hasCustomDomain || customDomain) && (
                <>
                    <ControlledTextAreaInput
                        name="certificate"
                        label="Certificate (pem)"
                        formProps={props}
                        className="DrawerFormField"
                        required={!props.hasCustomDomain}
                    />

                    <ControlledTextAreaInput
                        name="key"
                        label="Key (pem)"
                        formProps={props}
                        className="DrawerFormField"
                        required={!props.hasCustomDomain}
                    />
                </>
            )}

            {props.values.variables !== undefined && (
                <Box mb={3}>
                    <EnvironmentVariablesInput
                        label="Environment Variables"
                        values={props.values.variables}
                        add={(key: string, value: string) => {
                            props.handleChange('variables', [
                                ...(props.values.variables ?? []),
                                { key, value },
                            ]);
                        }}
                        remove={(key: string) => {
                            props.handleChange(
                                'variables',
                                props.values.variables?.filter((_) => _.key !== key),
                            );
                        }}
                    />
                </Box>
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

export default EnvironmentForm;
