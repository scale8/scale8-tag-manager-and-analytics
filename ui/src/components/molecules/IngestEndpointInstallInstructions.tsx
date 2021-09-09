import { ChangeEvent, FC, MouseEvent, useState } from 'react';
import { Box, FormControl, InputLabel, Select } from '@material-ui/core';
import CopyBlock from '../atoms/CopyBlock';
import { DataMapsPayload } from '../organisms/DataMapsPayloadBuilder';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import {
    IngestEndpointInstallInstructionCode,
    IngestEndpointInstallSnippet,
    ingestEndpointInstallSnippets,
} from '../atoms/IngestEndpointInstallInstructionCode';
import { Mode } from '../../gql/generated/globalTypes';
import { getNodeEnv } from '../../utils/ConfigUtils';

export type IngestEndpointInstallInstructionsDialogProps = {
    installDomain: string;
    customDomain: string | null;
    cname: string;
    payload: DataMapsPayload;
    mode: Mode;
    environmentId: string;
};

export type IngestEndpointInstallInstructionCodeProps = {
    endpoint: string;
    domain: string;
    port: string;
    path: string;
    payload: DataMapsPayload;
    snippet: IngestEndpointInstallSnippet;
};

const useStyles = makeStyles((theme) => ({
    tabButton: {
        minWidth: '120px',
        padding: theme.spacing(1),
    },
    selectedBtn: {
        color: '#000000 !important',
    },
    formControl: {
        marginBottom: theme.spacing(2),
        minWidth: 400,
        maxWidth: 400,
    },
    select: {
        '&:focus': {
            backgroundColor: 'transparent',
        },
    },
}));

const IngestEndpointInstallInstructions: FC<IngestEndpointInstallInstructionsDialogProps> = (
    props: IngestEndpointInstallInstructionsDialogProps,
) => {
    const classes = useStyles();

    const [tab, setTab] = useState('pixel');
    const [snippetId, setSnippetId] = useState('curl');

    const handleTab = (event: MouseEvent<HTMLElement>, newTab: string | null) => {
        if (newTab !== null) {
            setTab(newTab);
        }
    };

    const handleSnippetChange = (event: ChangeEvent<{ value: unknown }>) => {
        setSnippetId(event.target.value as string);
    };

    const domain =
        props.mode === Mode.COMMERCIAL
            ? `https://${props.installDomain}`
            : `${window.location.protocol}//${window.location.hostname}`;

    const path = props.mode === Mode.COMMERCIAL ? undefined : `/edge/${props.environmentId}`;

    const determinePort = () => {
        if (props.mode === Mode.COMMERCIAL) {
            if (getNodeEnv() === 'development') {
                return '5443';
            }
            return undefined;
        }
        return window.location.port;
    };

    const port = determinePort();

    const endpoint = `${domain}${port === undefined ? '' : `:${port}`}${path ?? ''}`;

    const currentSnippet = ingestEndpointInstallSnippets.find((_) => _.id === snippetId);

    return (
        <>
            <Box mt={2}>
                <ToggleButtonGroup value={tab} exclusive onChange={handleTab} aria-label="tab">
                    <ToggleButton
                        classes={{
                            root: classes.tabButton,
                            selected: classes.selectedBtn,
                        }}
                        value="pixel"
                        aria-label="Pixel"
                    >
                        Pixel
                    </ToggleButton>
                    <ToggleButton
                        classes={{
                            root: classes.tabButton,
                            selected: classes.selectedBtn,
                        }}
                        value="code"
                        aria-label="Code"
                    >
                        Code
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            {tab === 'pixel' && (
                <Box fontSize={12} mt={3} pb={2}>
                    <CopyBlock
                        text={`<!-- S8 Pixel -->\n<img width=0 height=0 src="${endpoint}/?d=${encodeURI(
                            JSON.stringify(props.payload),
                        )}" alt=""/>\n<!-- / S8 Pixel -->`}
                        language="html"
                    />
                </Box>
            )}
            {tab === 'code' && (
                <Box fontSize={12} mt={3} pb={2}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="select-language">Select Language</InputLabel>
                        <Select
                            native
                            value={snippetId}
                            onChange={handleSnippetChange}
                            classes={{
                                root: classes.select,
                            }}
                            label="Select Language"
                            inputProps={{
                                name: 'language',
                                id: 'select-language',
                            }}
                        >
                            {[...ingestEndpointInstallSnippets]
                                .sort((a, b) => (a.text > b.text ? 1 : -1))
                                .map((_) => (
                                    <option value={_.id} key={_.id}>
                                        {_.text}
                                    </option>
                                ))}
                        </Select>
                    </FormControl>
                    {currentSnippet !== undefined && (
                        <IngestEndpointInstallInstructionCode
                            domain={domain}
                            port={port ?? ''}
                            path={path ?? ''}
                            endpoint={endpoint}
                            payload={props.payload}
                            snippet={currentSnippet}
                        />
                    )}
                </Box>
            )}

            {props.customDomain !== null && (
                <Box pb={2}>
                    <Alert severity="info">
                        After you have successfully installed your custom domain, please create a
                        new CNAME record for “{props.customDomain}” with the value “{props.cname}”
                    </Alert>
                </Box>
            )}
        </>
    );
};

export default IngestEndpointInstallInstructions;
