// noinspection JSUnusedGlobalSymbols

import { FC, useState } from 'react';
import Head from 'next/head';
import DateInput from '../components/atoms/InputTypes/DateInput';
import { timestampToDataMapString, UTCTimestamp } from '../utils/DateTimeUtils';
import { Box, Button } from '@mui/material';

const DatetimeTester: FC = () => {
    const [value, setValue] = useState<UTCTimestamp | null>(null);
    const [reqValue, setReqValue] = useState<UTCTimestamp | null>(null);

    return (
        <>
            <Head>
                <title>Scale8 - Datetime Test</title>
                <meta name="description" content="Scale8 - Diff Test." />
            </Head>
            <Box p={2}>
                <form>
                    <DateInput
                        label="Test Date"
                        name="test"
                        value={value}
                        setValue={(v) => setValue(v)}
                    />
                    <Box mt={2} />
                    <DateInput
                        label="Test Date"
                        name="test"
                        value={value}
                        setValue={(v) => setValue(v)}
                        includeTime
                    />
                    <Box mt={2} />
                    <DateInput
                        label="Test Required Date"
                        name="test"
                        value={reqValue}
                        setValue={(v) => setReqValue(v)}
                        required
                    />
                    <Box mt={2} />
                    <Box>{JSON.stringify(value)}</Box>
                    <Box>{value === null ? 'null' : timestampToDataMapString(value)}</Box>
                    <Box mt={2} />
                    <Button type="submit" variant="contained" color="primary">
                        Test Submit
                    </Button>
                </form>
            </Box>
        </>
    );
};

export default DatetimeTester;
