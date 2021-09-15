import { FC, useEffect, useState } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { Box, Checkbox, Divider, FormControlLabel, useTheme } from '@material-ui/core';
import Loader from '../Loader';
import { AppFormProps } from '../../../dialogPages/tagManager/app/AppCreate';
import StorageProviderSelector from '../../molecules/StorageProviderSelector';
import ControlledBooleanSelect from '../../atoms/ControlledInputs/ControlledBooleanSelect';

const AppForm: FC<AppFormProps> = (props: AppFormProps) => {
    const theme = useTheme();

    const [useDomainName, setUseDomainName] = useState(
        props.useDomainName === undefined ? true : props.useDomainName,
    );

    const { values, handleChange } = props;

    useEffect(() => {
        if (values.domain !== '' && useDomainName && values.name !== props.values.domain) {
            handleChange('name', values.domain);
        }
    }, [values, handleChange, useDomainName]);

    return (
        <>
            {props.isSubmitting && props.isCreate ? (
                <Box display="flex" flexDirection="column" height="100vh">
                    <Box display="flex" alignItems="center" height={44}>
                        <Box ml={3} flexGrow={1} fontSize="h6.fontSize" display="flex">
                            Creating your application
                        </Box>
                    </Box>
                    <Divider />
                    <Box flex={1} position="relative" width="100%">
                        <Box p={3} height="100%" width="100%" position="absolute" overflow="auto">
                            <p>
                                Please wait while we build the data structure of your new
                                application.
                            </p>
                            <p>This typically only takes a few seconds.</p>
                            <Loader />
                        </Box>
                    </Box>
                </Box>
            ) : (
                <DrawerFormLayout {...props}>
                    <ControlledTextInput
                        name="domain"
                        label="Domain"
                        formProps={props}
                        className="DrawerFormField"
                        required
                    />
                    <FormControlLabel
                        style={{ marginBottom: theme.spacing(3) }}
                        control={
                            <Checkbox
                                name="useDomainName"
                                checked={useDomainName}
                                onChange={(event) => {
                                    setUseDomainName(event.target.checked);
                                }}
                                color="primary"
                            />
                        }
                        label="Use domain as Application name"
                    />
                    {!useDomainName && (
                        <ControlledTextInput
                            name="name"
                            label="Name"
                            formProps={props}
                            className="DrawerFormField"
                            required
                        />
                    )}
                    <ControlledBooleanSelect
                        label="Enable Analytics"
                        name="analyticsEnabled"
                        formProps={props}
                        className="DrawerFormField"
                        required
                    />
                    <ControlledBooleanSelect
                        label="Enable Error Tracking"
                        name="errorTrackingEnabled"
                        className="DrawerFormField"
                        formProps={props}
                        required
                    />
                    {(values.errorTrackingEnabled || values.analyticsEnabled) && (
                        <StorageProviderSelector {...props} />
                    )}
                </DrawerFormLayout>
            )}
        </>
    );
};

export default AppForm;
