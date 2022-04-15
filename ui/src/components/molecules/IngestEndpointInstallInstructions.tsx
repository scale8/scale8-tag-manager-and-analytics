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

export type IngestEndpointInstallInstructionsDialogProps = {
    installDomain: string;
    installEndpoint: string;
    cname: string;
    payload: DataMapsPayload;
    mode: Mode;
    environmentId: string;
};

export type IngestEndpointInstallInstructionCodeProps = {
    endpoint: string;
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
                        text={`<!-- S8 Pixel -->\n<img width=0 height=0 src="${
                            props.installEndpoint
                        }/?d=${encodeURI(
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
                            endpoint={props.installEndpoint}
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
