import { FC, useState } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { PricingSlider } from '../../components/molecules/PricingSlider';
import { Box, Button } from '@mui/material';
import { MainDrawerTitle } from '../../components/molecules/MainDrawerTitle';
import { useConfigState } from '../../context/AppContext';
import { SwitchPlanButton } from '../../components/molecules/ProductSelection/SwitchPlanButton';
import { pageActions } from '../../actions/PageActions';
import { buildThankYouPath } from '../../utils/NavigationPaths';
import { AccountProduct } from '../../gql/generated/globalTypes';

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
    //dialogProps.id
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

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <MainDrawerTitle handleDialogClose={dialogProps.handleDialogClose}>
                Change Plan
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
                            <Box height="0" width="100%" mt={8} />
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

                    <Box fontSize="20px" color="#666666" pb={2}>
                        Your price
                    </Box>
                    <Box fontSize="40px" fontWeight={600} color="#434343" pb="19px">
                        {custom ? 'Custom Pricing' : `$${price}/mo `}
                    </Box>
                {/*    {custom ? (*/}
                {/*            <Button*/}
                {/*                variant="contained"*/}
                {/*                onClick={() => {*/}
                {/*                }}*/}
                {/*                sx={{*/}
                {/*                    color: '#ffffff',*/}
                {/*                    backgroundColor: (theme) =>*/}
                {/*                        type === 'data'*/}
                {/*                            ? theme.palette.tagManagerColor.main*/}
                {/*                            : theme.palette.dataManagerColor.main,*/}
                {/*                    width: '100%',*/}
                {/*                }}*/}
                {/*                color="inherit"*/}
                {/*                disableElevation*/}
                {/*            >*/}
                {/*                Contact Us*/}
                {/*            </Button>*/}
                {/*    ) : (*/}
                {/*    if (currentProductId === null) {*/}
                {/*    return <SelectPlanButton {...props} />;*/}
                {/*}*/}
                {/*    if (currentProductId !== product.id) {*/}
                {/*    return <SwitchPlanButton {...props} />;*/}
                {/*}*/}

                {/*    /!*)}*!/*/}
                </Box>
            </Box>
        </Box>
    );
};

export default ChangePlan;
