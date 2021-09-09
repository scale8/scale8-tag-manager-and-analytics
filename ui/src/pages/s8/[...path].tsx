// noinspection JSUnusedGlobalSymbols

import { FC } from 'react';
import Head from 'next/head';
import { LoggedInSection } from '../../containers/global/LoggedInSection';
import { useRouter } from 'next/router';
import DynamicPageLoader from '../../pageLoader/DynamicPageLoader';
import { GetStaticPaths, GetStaticProps } from 'next';
import { dynamicPages } from '../../pageLoader/DynamicPages';

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = Object.values(dynamicPages).map((_) => {
        return {
            params: { path: _.split('/') },
        };
    });
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {}, // will be passed to the page component as props
    };
};

const LoggedInPage: FC = () => {
    const router = useRouter();

    const { path, ...params } = router.query;

    if (path == undefined) return <div />;

    return (
        <>
            <Head>
                <title>Scale8</title>
                <meta name="description" content="Scale8 - Admin." />
            </Head>
            <LoggedInSection>
                <DynamicPageLoader
                    page={(path as string[]).join('/')}
                    params={params as NodeJS.Dict<string>}
                />
            </LoggedInSection>
        </>
    );
};

export default LoggedInPage;
