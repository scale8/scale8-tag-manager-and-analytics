import { FC, useState } from 'react';
import { Box } from '@mui/material';
import SelectInput from '../atoms/InputTypes/SelectInput';
import CheckBoxInput from '../atoms/InputTypes/CheckBoxInput';
import CopyBlock from '../atoms/CopyBlock';
import { buildTagInstallMarkup } from '../../utils/TextUtils';
import { Mode } from '../../gql/generated/globalTypes';

export type InstallInstructionsProps = {
    installDomain: string;
    environmentName: string;
    environmentId: string;
    installEndpoint: string;
    mode: Mode;
    cname: string;
    tags: { name: string; code: string; type: string }[];
};

const EnvironmentInstallInstructions: FC<InstallInstructionsProps> = (
    props: InstallInstructionsProps,
) => {
    const [type, setType] = useState<'Tag Manager' | 'Analytics Only'>('Tag Manager');

    const [spaSupport, setSpaSupport] = useState(false);
    const [hashSupport, setHashSupport] = useState(false);

    const script = type === 'Tag Manager' ? 'tm.js' : 'analytics.js';

    const opts =
        type !== 'Tag Manager' && (spaSupport || hashSupport)
            ? `?opts=${spaSupport ? 'spa' : ''}${spaSupport && hashSupport ? ',' : ''}${
                  hashSupport ? 'hash' : ''
              }`
            : '';

    const commentAnalytics = type === 'Analytics Only' ? ' - Analytics Only' : '';
    const commentEnvironment = ` - Environment: ${props.environmentName} (${props.environmentId})`;
    const commentOpen = `<!-- Scale8 Tag Manager${commentAnalytics}${commentEnvironment} -->\n`;
    const commentClose = `\n<!-- / Scale8 Tag Manager -->`;

    const environmentInstallCode = `${commentOpen}<script src="${props.installEndpoint}/${script}${opts}" async></script>${commentClose}`;

    return (
        <>
            <Box>Please select the appropriate configuration for your application:</Box>
            <Box my={2} width="100%">
                <SelectInput
                    sx={{ width: 200 }}
                    value={type}
                    setValue={(v) => setType(v as 'Tag Manager' | 'Analytics Only')}
                    optionValues={['Tag Manager', 'Analytics Only']}
                    name="installation-type"
                    required
                />
            </Box>
            {type === 'Analytics Only' && (
                <Box my={2} width="100%">
                    <CheckBoxInput
                        name="spaSupport"
                        value={spaSupport}
                        setValue={(v) => {
                            setSpaSupport(v);
                        }}
                        label="Single Page Application Support"
                        color="primary"
                    />
                    <CheckBoxInput
                        name="hashSupport"
                        value={hashSupport}
                        setValue={(v) => {
                            setHashSupport(v);
                        }}
                        label="Application Hash Routing Support"
                        color="primary"
                    />
                </Box>
            )}
            Then install your environment by adding the following code in the head of your page:
            <Box fontSize={12} my={1}>
                <CopyBlock text={environmentInstallCode} language="html" />
            </Box>
            {type === 'Tag Manager' && (
                <>
                    {props.tags.length > 0 && (
                        <span>
                            Now you can install the following tags in the appropriate place:
                        </span>
                    )}
                    {props.tags.map((tag) => (
                        <Box fontSize={12} my={1} key={tag.code}>
                            <CopyBlock
                                text={buildTagInstallMarkup(tag.name, tag.code, tag.type)}
                                language="html"
                            />
                        </Box>
                    ))}
                </>
            )}
        </>
    );
};

export default EnvironmentInstallInstructions;
