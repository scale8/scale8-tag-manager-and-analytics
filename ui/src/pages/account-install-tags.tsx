import { TagManagerInstallInstructions } from '../lazyComponents/TagManagerInstallInstructions';
import { ComponentWithParams, ParamsLoader } from '../components/atoms/ParamsLoader';
import Head from 'next/head';
import LoggedOutSection from '../containers/global/LoggedOutSection';
import SignUpContainer from '../components/molecules/SignUpContainer';

const AccountInstallTags: ComponentWithParams = ({ params }) => {
    const { env, target } = params;

    return (
        <>
            <Head>
                <title>Scale8 - Sign Up</title>
                <meta name="description" content="Scale8 - Sign Up page." />
            </Head>
            <LoggedOutSection stayLogged>
                <SignUpContainer
                    type="tag-manager"
                    target={target}
                    isCompleted={false}
                    isPrepare={true}
                    installTags={true}
                >
                    <TagManagerInstallInstructions
                        environmentId={env ?? ''}
                        link={target ?? ''}
                        text="I have installed my Tags"
                    />
                </SignUpContainer>
            </LoggedOutSection>
        </>
    );
};

const AccountInstallTagsLoader = () => <ParamsLoader Child={AccountInstallTags} />;
export default AccountInstallTagsLoader;
