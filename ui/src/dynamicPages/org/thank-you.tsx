import { FC, useEffect, useRef, useState } from 'react';
import { Box, Container, Paper } from '@mui/material';
import { useQuery } from '@apollo/client';
import ProductSettingsQuery from '../../gql/queries/ProductSettingsQuery';
import { ProductSettings } from '../../gql/generated/ProductSettings';
import Typography from '@mui/material/Typography';
import { toOrg } from '../../utils/NavigationPaths';
import Loader from '../../components/organisms/Loader';
import Navigate from '../../components/atoms/Next/Navigate';
import { QueryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import NavigateWithError from '../../components/atoms/Next/NavigateWithError';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';

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

    if (triesLeft === 0) {
        if (timer.current !== null) {
            clearInterval(timer.current);
        }
    }

    return QueryLoaderAndError<ProductSettings>(
        true,
        useQuery<ProductSettings>(ProductSettingsQuery, {
            variables: {
                id: id,
            },
        }),
        (data: ProductSettings, valuesRefresh: (mustResetCache: boolean) => void) => {
            if (triesLeft != 10 && triesLeft !== 0) {
                valuesRefresh(true);
            }

            if (product === 'tag-manager') {
                if (
                    data.getOrg.tag_manager_account.enabled &&
                    !data.getOrg.tag_manager_account.is_trial &&
                    data.getOrg.tag_manager_account.stripe_product_id === plan_id
                ) {
                    if (timer.current !== null) {
                        clearInterval(timer.current);
                    }
                    return <Navigate to={toOrg({ id: data.getOrg.id }, 'settings')} />;
                }
            }

            if (product === 'data-manger') {
                if (
                    data.getOrg.data_manager_account.enabled &&
                    !data.getOrg.data_manager_account.is_trial &&
                    data.getOrg.data_manager_account.stripe_product_id === plan_id
                ) {
                    if (timer.current !== null) {
                        clearInterval(timer.current);
                    }
                    return <Navigate to={toOrg({ id: data.getOrg.id }, 'settings')} />;
                }
            }

            if (triesLeft === 0) {
                return (
                    <NavigateWithError
                        to={toOrg({ id: data.getOrg.id }, 'settings')}
                        error={
                            'There was an error processing your payment, please check your payment details and try again.'
                        }
                    />
                );
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
        },
    );
};

export default OrgThankYouPage;
