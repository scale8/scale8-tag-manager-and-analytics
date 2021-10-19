// noinspection JSUnusedGlobalSymbols

import { FC } from 'react';
import { Box } from '@mui/material';
import Head from 'next/head';
import { Usage } from '../lazyComponents/Usage';
import { InfoProps } from '../components/molecules/InfoButton';
import { QueryResult } from '@apollo/client/react/types/types';

const UsageTester: FC = () => {
    return (
        <>
            <Head>
                <title>Scale8 - Diff Test</title>
                <meta name="description" content="Scale8 - Diff Test." />
            </Head>

            <Box p={3}>
                <Usage
                    sourceId="testId"
                    handleDialogClose={() => {
                        /**/
                    }}
                    label1="Lbl1"
                    formInfoProps={{} as InfoProps}
                    extractUsage={() => []}
                    mainQuery={
                        {
                            data: [],
                            loading: false,
                            refetch: () => {
                                /**/
                            },
                        } as QueryResult
                    }
                />
            </Box>
        </>
    );
};

export default UsageTester;
