import { FC, useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { TemplatedActionFormProps } from '../../types/props/forms/TemplatedActionFormProps';
import clsx from 'clsx';
import { actionPermissionsFromCode } from '../../utils/ActionPermissionsUtils';
import LazyCodeEditor from '../atoms/LibraryLoaders/LazyCodeEditor';

const useStyles = makeStyles((theme) =>
    createStyles({
        codeContainer: {
            width: '100%',
            borderRadius: '5px',
            border: '1px solid #bbbbbb',
            backgroundColor: '#f6f6f6',
            padding: '2px',
        },
        label: {
            marginLeft: theme.spacing(1),
            marginTop: theme.spacing(1),
            fontSize: '0.9em',
        },
        errorContainer: {
            border: '1px solid #ff1744',
        },
        errorLabel: {
            color: '#ff1744',
        },
        errorMessage: {
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
        },
        container: {
            height: '100%',
            width: '100%',
            display: 'flex',
            flexFlow: 'column nowrap',
        },
    }),
);

const TemplatedActionCodeInput: FC<TemplatedActionFormProps> = (
    props: TemplatedActionFormProps,
) => {
    const classes = useStyles();
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
        <div className={classes.container}>
            <label className={clsx(classes.label, validationError && classes.errorLabel)}>
                Templated Action Code *
            </label>
            <Box flex={1} position="relative">
                <Box height="100%" position="absolute" width="100%" overflow="auto">
                    <div
                        className={clsx(
                            classes.codeContainer,
                            validationError && classes.errorContainer,
                        )}
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
                    </div>
                    <p className={classes.errorMessage}>{validationError}</p>
                </Box>
            </Box>
        </div>
    );
};

export default TemplatedActionCodeInput;
