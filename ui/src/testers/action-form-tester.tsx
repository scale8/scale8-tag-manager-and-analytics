// noinspection JSUnusedGlobalSymbols

import { FC } from 'react';
import ActionForm from '../components/organisms/Forms/ActionForm';
import CopyBlock from '../components/atoms/CopyBlock';
import Head from 'next/head';
import { SxBox } from '../components/atoms/SxBox';
import { useMockActionFormProps } from '../../tests/componentsMocks/useMockActionFormProps';

const ActionFormTester: FC = () => {
    const formProps = useMockActionFormProps();

    return (
        <>
            <Head>
                <title>Scale8 - Action Form Test</title>
                <meta name="description" content="Scale8 - Action Form Test." />
            </Head>

            <SxBox
                sx={{
                    display: 'flex',
                }}
            >
                <SxBox
                    sx={{
                        flex: 1,
                        p: 3,
                        borderRight: '1px solid black',
                        minHeight: '100vh',
                    }}
                >
                    <ActionForm {...formProps} />
                </SxBox>
                <SxBox
                    sx={{
                        flex: 1,
                        p: 3,
                    }}
                >
                    <CopyBlock
                        text={JSON.stringify(formProps.values.mappedPlatformValues ?? [], null, 2)}
                        language="json"
                    />
                </SxBox>
            </SxBox>
        </>
    );
};

export default ActionFormTester;
