import { FC, useState } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { PricingSlider } from '../../components/molecules/PricingSlider';
import { Box } from '@mui/material';
import { MainDrawerTitle } from '../../components/molecules/MainDrawerTitle';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import { ButtonSelector } from '../../components/molecules/ProductSelection/ButtonSelector';
import { PageActionProps } from '../../actions/PageActions';
import { PricingInclude } from '../../components/molecules/PricingInclude';

type ChangePlanProps = DialogPageProps & { type: 'tag' | 'data' };

const getPlanPageViews = (plans: any[], index: number): string => {
    return (
        plans[index] as {
            page_views: number;
        }
    ).page_views.toLocaleString('en-GB');
};

const getPlanRequests = (plans: any[], index: number): string => {
    return (
        plans[index] as {
            requests: number;
        }
    ).requests.toLocaleString('en-GB');
};

const getPlanGbs = (plans: any[], index: number): string => {
    return (
        plans[index] as {
            gbs: number;
        }
    ).gbs.toLocaleString('en-GB');
};

const ChangePlan: FC<ChangePlanProps> = ({ type, ...dialogProps }) => {
    const { tagManagerProducts, dataManagerProducts } = useConfigState();
    const { templateInteractions } = useLoggedInState();
    const { dispatchDialogAction, setRefreshCurrentPage } = templateInteractions;

    const buildPlans = () => {
        if (type === 'tag') {
            return [...tagManagerProducts].sort((a, b) => a.page_views! - b.page_views!);
        }
        return [...dataManagerProducts].sort((a, b) => a.requests! - b.requests!);
    };

    const plans = buildPlans();

    const currentIndex = plans.findIndex((_) => _.id === dialogProps.id);

    const [planIndex, setPlanIndex] = useState<number>(currentIndex === -1 ? 0 : currentIndex);

    const custom = planIndex >= plans.length;
    const price = planIndex >= plans.length ? 0 : plans[planIndex].amount / 100;

    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
        refresh: () => {
            setRefreshCurrentPage(true);
        },
    };

    const accountDetails =
        type === 'tag'
            ? [
                  `Up to <strong>${
                      custom ? 'unlimited' : getPlanPageViews(plans, planIndex)
                  } requests</strong> (page views) per month`,
                  'Up to 5 applications',
                  'Revision versioning & difference tools',
                  '<strong>Multiple</strong> environments and deployments',
                  'Access to our integration ecosystem',
                  'Ability to create action distributions',
                  'Server-to-server support*',
                  'Custom domain (bring your own cert)',
                  'Super fast tag delivery network',
                  'Data layer management',
                  'Access to all events, conditions and exceptions',
                  'Create multiple rule groups and rules',
                  'Preview revisions on any browser, on any device',
                  'Full developer API access',
                  'Setup assistance',
                  'Technical support',
              ]
            : [
                  `Up to <strong>${
                      custom ? 'unlimited' : getPlanRequests(plans, planIndex)
                  } requests</strong> per month`,
                  `Up to <strong>${
                      custom ? 'unlimited' : getPlanGbs(plans, planIndex)
                  } GB</strong> of ingest data per month`,
                  'Up to 5 ingest endpoints',
                  'Revision versioning & difference tools',
                  '<strong>Multiple</strong> environments and deployments',
                  'Macro support',
                  'Custom domain (bring your own cert)',
                  'Super fast data network',
                  'Access to all cloud integrations',
                  'Full developer API access',
                  'Setup assistance',
                  'Technical support',
              ];

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <MainDrawerTitle handleDialogClose={dialogProps.handleDialogClose}>
                {dialogProps.id === null || dialogProps.id === '' ? 'Select' : 'Change'} Plan
            </MainDrawerTitle>
            <Box flex={1} position="relative" width="100%">
                <Box p={3} height="100%" width="100%" position="absolute" overflow="auto">
                    {type === 'tag' && (
                        <PricingSlider
                            type={type}
                            max={plans.length}
                            question="How many monthly page views do you receive?"
                            adjustText="Adjust for your monthly page views"
                            value={planIndex}
                            setValue={setPlanIndex}
                            displayValue={
                                planIndex < plans.length
                                    ? getPlanPageViews(plans, planIndex)
                                    : `>${getPlanPageViews(plans, plans.length - 1)}`
                            }
                        />
                    )}
                    {type === 'data' && (
                        <>
                            <PricingSlider
                                max={plans.length}
                                type={type}
                                question="How many requests will you make per month?"
                                adjustText="Adjust for your monthly requests"
                                value={planIndex}
                                setValue={setPlanIndex}
                                displayValue={
                                    planIndex < plans.length
                                        ? getPlanRequests(plans, planIndex)
                                        : `>${getPlanRequests(plans, plans.length - 1)}`
                                }
                            />
                            <Box height="0" width="100%" mt={4} />
                            <PricingSlider
                                max={plans.length}
                                type={type}
                                question="How many gigabytes of data will you send per month?"
                                adjustText="Adjust for your data usage"
                                value={planIndex}
                                setValue={setPlanIndex}
                                displayValue={
                                    planIndex < plans.length
                                        ? getPlanGbs(plans, planIndex)
                                        : `>${getPlanGbs(plans, plans.length - 1)}`
                                }
                            />
                        </>
                    )}

                    <Box fontWeight="bold" py={2}>
                        Your price
                    </Box>
                    <Box fontSize="25px" fontWeight={600} pb="19px">
                        {custom ? 'Custom Pricing' : `$${price}/mo `}
                    </Box>
                    <ButtonSelector
                        type={type}
                        product={custom ? undefined : plans[planIndex]}
                        currentProductId={dialogProps.id ?? null}
                        pageActionProps={pageActionProps}
                        orgId={dialogProps.contextId}
                        subscriptionType={dialogProps.name === 'paid' ? 'paid' : 'free'}
                    />
                    <Box height={32} />
                    <PricingInclude elements={accountDetails} moreAfter={type === 'tag' ? 2 : 3} />
                </Box>
            </Box>
        </Box>
    );
};

export default ChangePlan;
