import { FC, useEffect, useRef, useState } from 'react';
import { Box, Container, Paper } from '@mui/material';
import { useMutation } from '@apollo/client';
import Typography from '@mui/material/Typography';
import { toOrg } from '../../utils/NavigationPaths';
import Loader from '../../components/organisms/Loader';
import Navigate from '../../components/atoms/Next/Navigate';
import NavigateWithError from '../../components/atoms/Next/NavigateWithError';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import AlignSubscriptionQuery from '../../gql/mutations/AlignSubscriptionQuery';
import GQLError from '../../components/atoms/GqlError';
import { AlignSubscription } from '../../gql/generated/AlignSubscription';
import GenericError from '../../components/atoms/GenericError';

const OrgThankYouPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const { id, product, plan_id } = props.params;

    const [triesLeft, setTriesLeft] = useState(0);
    const timer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // reset tries
        setTriesLeft(10);
        timer.current = setInterval(() => {
            setTriesLeft((v) => v - 1);
        }, 5000);
        return () => {
            if (timer.current !== null) {
                clearInterval(timer.current);
            }
        };
    }, []);

    const [alignSubscription, { data, error }] =
        useMutation<AlignSubscription>(AlignSubscriptionQuery);

    useEffect(() => {
        if (triesLeft === 0) {
            if (timer.current !== null) {
                clearInterval(timer.current);
            }
        } else {
            alignSubscription({
                variables: {
                    alignSubscriptionInput: {
                        org_id: id,
                    },
                },
            }).then();
        }
    }, [triesLeft]);

    if (id === undefined) {
        return <GenericError error="Error fetching Org id" />;
    }

    if (error) {
        if (timer.current !== null) {
            clearInterval(timer.current);
        }
        return <GQLError error={error} />;
    }

    if (data && triesLeft === 0) {
        return (
            <NavigateWithError
                to={toOrg({ id }, 'settings')}
                error={
                    'There was an error processing your payment, please check your payment details and try again.'
                }
            />
        );
    }

    if (data) {
        const accountData =
            product === 'tag-manager'
                ? data.alignSubscription.tag_manager_account
                : data.alignSubscription.data_manager_account;

        if (
            accountData.enabled &&
            !accountData.is_trial &&
            accountData.stripe_product_id === plan_id
        ) {
            if (timer.current !== null) {
                clearInterval(timer.current);
            }
            return <Navigate to={toOrg({ id }, 'settings')} />;
        }
    }

    return (
        <Box my={4}>
            <Container maxWidth="sm">
                <Paper elevation={5}>
                    <Loader />
                    <Box textAlign="center" p={2}>
                        <Typography variant="h5" component="h2">
                            Thank you!
                        </Typography>
                    </Box>
                    <Box fontSize="1.2em" textAlign="center" p={2}>
                        Please wait while we process your payment...
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default OrgThankYouPage;
