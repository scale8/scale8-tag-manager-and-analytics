// noinspection JSUnusedGlobalSymbols

import { FC } from 'react';
import { Box } from '@mui/material';
import Diff from '../components/molecules/Diff/Diff';
import { addHasChangesToDiffMap } from '../utils/DiffUtils';
import Head from 'next/head';
import { mockDiffMap } from './mock/MockDiffMap';

const DiffTester: FC = () => {
    const diffMap = mockDiffMap.defaultCase;

    addHasChangesToDiffMap('mainFields', diffMap);

    console.log(diffMap);
    const mainFields = diffMap.get('mainFields');

    if (mainFields === undefined) {
        return <div>mainFields somehow undefined</div>;
    }

    return (
        <>
            <Head>
                <title>Scale8 - Diff Test</title>
                <meta name="description" content="Scale8 - Diff Test." />
            </Head>

            <Box p={3}>
                <Diff
                    objKey={'mainFields'}
                    diffMap={diffMap}
                    leftId="Left Side"
                    rightId="Right Side"
                />
            </Box>
        </>
    );
};

export default DiffTester;
