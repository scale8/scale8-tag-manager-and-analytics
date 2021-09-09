import { FC, ReactNode } from 'react';
import { Box } from '@material-ui/core';
import TmLogo from '../atoms/TmLogo';
import DmLogo from '../atoms/DmLogo';
import LoggedOutFormContainer from './LoggedOutFormContainer';
import SignUpProgress from '../atoms/SignUpProgress';

export type SignUpContainerProps = {
    type: string;
    target: string | undefined;
    children: ReactNode;
    isCompleted: boolean;
    isPrepare: boolean;
};

const SignUpContainer: FC<SignUpContainerProps> = (props: SignUpContainerProps) => {
    const { children, type, target, isCompleted, isPrepare } = props;

    const buildSectionTitle = (): string => {
        if (type === 'tag-manager' || type === 'data-manager') {
            return 'Sign-up for an unlimited 30 day free trial.';
        }

        return `You’ve been invited to join ${target ?? 'an organization'}.`;
    };

    const buildSectionSubtitle = (): string => {
        if (isPrepare) {
            if (type === 'tag-manager') {
                return 'Please install your tags to start using our tag manager.';
            }
            return 'Please wait while we prepare your account.';
        }

        if (isCompleted) {
            return 'Almost done, we just need to confirm your email address for security purposes.';
        }

        if (type === 'tag-manager' || type === 'data-manager') {
            return 'No payment information or credit card is required.';
        }

        return 'It is free to sign-up, no credit card is required.';
    };

    return (
        <div>
            {type === 'tag-manager' && (
                <Box textAlign="center" py={4} mt="-100px">
                    <TmLogo height={151} />
                </Box>
            )}
            {type === 'data-manager' && (
                <Box textAlign="center" py={4} mt="-100px">
                    <DmLogo height={151} />
                </Box>
            )}
            {type === 'invitation' && <Box pt={1} />}

            <Box
                fontWeight={600}
                fontSize={40}
                lineHeight="46px"
                color="#434343"
                width="100%"
                textAlign="center"
            >
                {buildSectionTitle()}
            </Box>

            <Box pt={1} />
            <Box fontSize={20} color="#676767" width="100%" textAlign="center">
                {buildSectionSubtitle()}
            </Box>
            <Box pt={2} />
            <LoggedOutFormContainer large>
                <SignUpProgress {...props} />
                {children}
            </LoggedOutFormContainer>
        </div>
    );
};

export default SignUpContainer;
