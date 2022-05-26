import { FC } from 'react';
import { loadStripe } from '@stripe/stripe-js/pure';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { ApolloError } from '@apollo/client/errors';
import { useConfigState, useLoggedInState } from '../../context/AppContext';

const SubscriptionStripe: FC<{ session: string }> = (props: { session: string }) => {
    const { templateInteractions } = useLoggedInState();
    const { setSnackbarError } = templateInteractions;

    const stripe = useStripe();
    if (stripe) {
        (async () => {
            const stripeResult = await stripe.redirectToCheckout({
                sessionId: props.session,
            });

            if (stripeResult && stripeResult.error) {
                setSnackbarError({
                    message: 'Cannot connect to Stripe, please try later.',
                } as ApolloError);
            }
        })();
    }

    return null;
};

const StripeCheckout: FC<{ session: string }> = (props: { session: string }) => {
    const { session } = props;
    const { stripePublishable } = useConfigState();

    const stripePromise = loadStripe(stripePublishable);
    return (
        <Elements stripe={stripePromise}>
            <SubscriptionStripe session={session} />
        </Elements>
    );
};

export default StripeCheckout;
