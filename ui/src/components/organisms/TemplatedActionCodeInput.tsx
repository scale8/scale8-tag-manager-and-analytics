import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { TemplatedActionFormProps } from '../../types/props/forms/TemplatedActionFormProps';
import { actionPermissionsFromCode } from '../../utils/ActionPermissionsUtils';
import LazyCodeEditor from '../atoms/LibraryLoaders/LazyCodeEditor';

const TemplatedActionCodeInput: FC<TemplatedActionFormProps> = (
    props: TemplatedActionFormProps,
) => {
    const validationError = props.errors['code'];

    const [permissionRequestsChanged, setPermissionRequestsChanged] = useState(false);

    useEffect(() => {
        if (permissionRequestsChanged) {
            props.handleBlur();
            setPermissionRequestsChanged(false);
        }
    }, [permissionRequestsChanged]);

    const onBlur = () => {
        props.handleChange(
            'permissionRequests',
            actionPermissionsFromCode(
                !props.values['execRaw'],
                props.values['code'],
                props.values['permissionRequests'],
            ),
        );
        setPermissionRequestsChanged(true);
    };

    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexFlow: 'column nowrap',
            }}
        >
            <Box
                component="label"
                sx={{
                    color: validationError ? '#ff1744' : undefined,
                    marginLeft: 1,
                    marginTop: 1,
                    fontSize: '0.9em',
                }}
            >
                Templated Action Code *
            </Box>
            <Box flex={1} position="relative">
                <Box height="100%" position="absolute" width="100%" overflow="auto">
                    <Box
                        sx={{
                            width: '100%',
                            borderRadius: '5px',
                            border: validationError ? '1px solid #ff1744' : '1px solid #bbbbbb',
                            backgroundColor: '#f6f6f6',
                            padding: '2px',
                        }}
                    >
                        <LazyCodeEditor
                            onBlur={onBlur}
                            value={props.values['code']}
                            onChange={(value) => {
                                props.handleChange('code', value);
                            }}
                            mode="javascript"
                            theme="tomorrow"
                            name="code"
                            minLines={10}
                            maxLines={Infinity}
                            width="100%"
                            readOnly={props.readOnly}
                            setOptions={{
                                enableBasicAutocompletion: false,
                                enableLiveAutocompletion: false,
                                enableSnippets: false,
                                showLineNumbers: true,
                                tabSize: 4,
                                useWorker: false,
                            }}
                        />
                    </Box>
                    <Box
                        component="p"
                        sx={{
                            marginLeft: '14px',
                            marginRight: '14px',
                            color: '#ff1744',
                            margin: 0,
                            fontSize: '0.75rem',
                            marginTop: '3px',
                            textAlign: 'left',
                            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                            lineHeight: '1.66',
                            letterSpacing: '0.03333em',
                            fontWeight: 400,
                        }}
                    >
                        {validationError}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TemplatedActionCodeInput;
