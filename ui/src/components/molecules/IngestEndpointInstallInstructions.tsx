import { FC, MouseEvent, useState } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import CopyBlock from '../atoms/CopyBlock';
import { DataMapsPayload } from '../organisms/DataMapsPayloadBuilder';
import {
    IngestEndpointInstallInstructionCode,
    IngestEndpointInstallSnippet,
    ingestEndpointInstallSnippets,
} from '../atoms/IngestEndpointInstallInstructionCode';
import { Mode } from '../../gql/generated/globalTypes';
import { getNodeEnv } from '../../utils/ConfigUtils';

export type IngestEndpointInstallInstructionsDialogProps = {
    installDomain: string;
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

const IngestEndpointInstallInstructions: FC<IngestEndpointInstallInstructionsDialogProps> = (
    props: IngestEndpointInstallInstructionsDialogProps,
) => {
    const [tab, setTab] = useState('pixel');
    const [snippetId, setSnippetId] = useState('curl');

    const handleTab = (event: MouseEvent<HTMLElement>, newTab: string | null) => {
        if (newTab !== null) {
            setTab(newTab);
        }
    };

    const handleSnippetChange = (event: SelectChangeEvent) => {
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
                return '8443';
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
                        sx={{
                            minWidth: '120px',
                            padding: 1,
                            '&.Mui-selected': {
                                color: '#000000 !important',
                            },
                        }}
                        value="pixel"
                        aria-label="Pixel"
                    >
                        Pixel
                    </ToggleButton>
                    <ToggleButton
                        sx={{
                            minWidth: '120px',
                            padding: 1,
                            '&.Mui-selected': {
                                color: '#000000 !important',
                            },
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
                    <FormControl
                        variant="outlined"
                        sx={{
                            marginBottom: 2,
                            minWidth: 400,
                            maxWidth: 400,
                        }}
                    >
                        <InputLabel htmlFor="select-language">Select Language</InputLabel>
                        <Select
                            native
                            value={snippetId}
                            onChange={handleSnippetChange}
                            sx={{
                                '&:focus': {
                                    backgroundColor: 'transparent',
                                },
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
        </>
    );
};

export default IngestEndpointInstallInstructions;
