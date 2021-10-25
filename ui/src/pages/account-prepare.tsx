import { FC, useEffect, useRef } from 'react';
import Head from 'next/head';
import SignUpContainer from '../components/molecules/SignUpContainer';
import { useParams } from '../hooks/useParams';
import Loader from '../components/organisms/Loader';
import { Box } from '@mui/material';
import { TagManagerInstallInstructions } from '../lazyComponents/TagManagerInstallInstructions';
import { useMutation } from '@apollo/client';
import { CompleteSignUp } from '../gql/generated/CompleteSignUp';
import CompleteSignUpQuery from '../gql/mutations/CompleteSignUpQuery';
import { CompleteSignUpInput } from '../gql/generated/globalTypes';
import { buildSignUpType } from '../utils/SignUpUtils';
import Link from '../components/atoms/Next/Link';
import { useRouter } from 'next/router';
import LoggedOutSection from '../containers/global/LoggedOutSection';
import { toSignUp } from '../utils/NavigationPaths';
import { logError } from '../utils/logUtils';

type AccountPrepareContentProps = {
    type: string;
    token: string;
};

const AccountPrepareContent: FC<AccountPrepareContentProps> = (
    props: AccountPrepareContentProps,
) => {
    const { type, token } = props;

    const router = useRouter();

    const [complete, { data, error: gqlError }] = useMutation<CompleteSignUp>(CompleteSignUpQuery);

    const completeSignup = () => {
        localStorage.removeItem('uid');
        localStorage.removeItem('token');

        const completeSignUpInput: CompleteSignUpInput = {
            sign_up_type: buildSignUpType(type),
            token,
        };

        (async () => {
            try {
                await complete({
                    variables: { completeSignUpInput },
                });
            } catch (error) {
                logError(error);
            }
        })();
    };

    const timer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        timer.current = setTimeout(() => {
            completeSignup();
        }, 2000);
        return () => {
            if (timer.current !== null) {
                clearTimeout(timer.current);
            }
        };
    }, []);

    const completeSignUp = data?.completeSignUp;

    useEffect(() => {
        if (completeSignUp !== undefined && type !== 'tag-manager') {
            if (completeSignUp.uid !== '' && completeSignUp.token !== '') {
                localStorage.setItem('uid', completeSignUp.uid);
                localStorage.setItem('token', completeSignUp.token);
            }

            router.push(completeSignUp.url).then();
        }
    }, [completeSignUp]);

    if (gqlError) {
        return (
            <Box mb={2} width="100%">
                <Box py={10}>
                    <Box fontSize={18} width="100%" textAlign="center">
                        Your sign up request was unsuccessful, please{' '}
                        <Link
                            href={toSignUp({ type: type === 'invite' ? 'tag-manager' : type })}
                            sx={{ color: '#1b1b1b' }}
                        >
                            sign up again
                        </Link>
                        .
                    </Box>
                </Box>
            </Box>
        );
    }

    if (
        completeSignUp !== undefined &&
        type === 'tag-manager' &&
        completeSignUp.environment_id !== null
    ) {
        localStorage.setItem('uid', completeSignUp.uid);
        localStorage.setItem('token', completeSignUp.token);

        return (
            <TagManagerInstallInstructions
                environmentId={completeSignUp.environment_id}
                link={completeSignUp.url}
                text="I have installed my Tags"
            />
        );
    }

    return (
        <>
            <Box fontSize={18} width="100%" textAlign="center">
                We are just setting up your new account
                {type === 'tag-manager' && (
                    <>
                        <br />
                        and configuring your first application
                    </>
                )}
                .<br />
                This should just take a few seconds.
            </Box>
            <Loader />
        </>
    );
};

const AccountPrepare: FC = () => {
    const { type, target, token } = useParams();

    return (
        <>
            <Head>
                <title>Scale8 - Sign Up</title>
                <meta name="description" content="Scale8 - Sign Up page." />
            </Head>
            <LoggedOutSection>
                <SignUpContainer
                    type={type ?? 'tag-manager'}
                    target={target}
                    isCompleted={false}
                    isPrepare={true}
                >
                    <AccountPrepareContent type={type ?? 'tag-manager'} token={token ?? ''} />
                </SignUpContainer>
            </LoggedOutSection>
        </>
    );
};

export default AccountPrepare;
