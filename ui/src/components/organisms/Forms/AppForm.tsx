import { FC, useEffect, useState } from 'react';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import { Box, Checkbox, Divider, FormControlLabel } from '@mui/material';
import Loader from '../Loader';
import { AppFormProps } from '../../../dialogPages/tagManager/app/AppCreate';
import StorageProviderSelector from '../../molecules/StorageProviderSelector';
import CheckBoxInput from '../../atoms/InputTypes/CheckBoxInput';
import { Mode } from '../../../gql/generated/globalTypes';
import { useConfigState } from '../../../context/AppContext';

const AppForm: FC<AppFormProps> = (props: AppFormProps) => {
    const { mode } = useConfigState();

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
                        sx={{ marginBottom: (theme) => theme.spacing(3) }}
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

                    {mode !== Mode.COMMERCIAL && (
                        <>
                            <CheckBoxInput
                                name="analyticsEnabled"
                                value={props.values.analyticsEnabled}
                                setValue={(v) => {
                                    props.handleChange('analyticsEnabled', v);
                                }}
                                label="Enable Analytics"
                                className="DrawerFormField"
                                sx={{ marginLeft: '-11px!important' }}
                                color="primary"
                            />
                            <Box
                                component="small"
                                className="DrawerFormField"
                                sx={{ marginTop: '-24px' }}
                            >
                                Enable simple analytics dashboard when using Tag Manager. We
                                recommend this option is left enabled.
                            </Box>
                            <CheckBoxInput
                                name="errorTrackingEnabled"
                                value={props.values.errorTrackingEnabled}
                                setValue={(v) => {
                                    props.handleChange('errorTrackingEnabled', v);
                                }}
                                label="Enable Error Tracking"
                                className="DrawerFormField"
                                sx={{ marginLeft: '-11px!important' }}
                                color="primary"
                            />
                            <Box
                                component="small"
                                className="DrawerFormField"
                                sx={{ marginTop: '-24px' }}
                            >
                                Enable basic website and mobile website application errors directly
                                in the dashboard. If you are using another service you may wish to
                                disable this option.
                            </Box>
                            {(props.values.analyticsEnabled ||
                                props.values.errorTrackingEnabled) && (
                                <StorageProviderSelector
                                    {...props}
                                    warnGraphDisabled
                                    infoText="Your analytics and error data will be sent to your
                                            chosen storage provider. MongoDB is a great solution for
                                            very low traffic websites and doesn't require any
                                            configuration unless you wish to specify your own
                                            MongoDB servers. We strongly recommend using BigQuery or
                                            Clickhouse for larger websites."
                                />
                            )}
                        </>
                    )}
                </DrawerFormLayout>
            )}
        </>
    );
};

export default AppForm;
