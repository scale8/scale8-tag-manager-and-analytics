import { FC, useEffect, useState } from 'react';
import { getApiUrl } from '../../../utils/ConfigUtils';
import { unMinifyCodeWithErrorCoordinatesMapping } from '../../../utils/CodeUtils';
import { Box, Paper } from '@mui/material';
import LazyShiki from '../../atoms/LibraryLoaders/LazyShiki';
import { DetailTitle } from './DetailTitle';
import { keyframes } from '@emotion/react';

export const CodeBox: FC<{ fileUrl: string; errorRow: number; errorCol: number }> = ({
    fileUrl,
    errorRow,
    errorCol,
}) => {
    const [code, setCode] = useState<string | null>(null);
    const [row, setRow] = useState(0);
    const [col, setCol] = useState(0);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `${getApiUrl()}/api/fetch-as-text?url=${encodeURIComponent(fileUrl)}`,
                    {
                        method: 'GET',
                        redirect: 'follow',
                    },
                );
                const data = await response.json();
                const [unminifiedCode, unminifiedRow, unminifiedCol] =
                    unMinifyCodeWithErrorCoordinatesMapping(data.contents, errorRow, errorCol);

                setCode(unminifiedCode);
                setRow(unminifiedRow);
                setCol(unminifiedCol);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [fileUrl]);

    const blink = keyframes({
        '0%': {
            opacity: 0,
        },
        '50%': {
            opacity: 1,
        },
        '100%': {
            opacity: 0,
        },
    });

    return (
        <>
            <DetailTitle>
                {code === null || (errorRow === row && errorCol === col) ? (
                    <b>
                        Code (Error at Line: {errorRow} Column: {errorCol}):
                    </b>
                ) : (
                    <b>
                        Code (Error at Line: {errorRow} Column: {errorCol}, un-minified at Line:{' '}
                        {row} Column: {col}):
                    </b>
                )}
            </DetailTitle>
            <Box zIndex={1} height={250}>
                <Paper
                    elevation={5}
                    style={{
                        height: 250,
                        backgroundColor: '#2e3440',
                        zIndex: 2,
                        borderRadius: 0,
                    }}
                >
                    <Box color="white" pl={1} pt={1} height={30} overflow="hidden">
                        Loading...
                        <Box
                            component="span"
                            sx={{
                                animation: `${blink} 2s infinite`,
                            }}
                        >
                            .
                        </Box>
                    </Box>
                    {code !== null && (
                        <Box marginTop="-30px" height="100%">
                            <LazyShiki language="js" code={code} errorPosition={{ row, col }} />
                        </Box>
                    )}
                </Paper>
            </Box>
        </>
    );
};
