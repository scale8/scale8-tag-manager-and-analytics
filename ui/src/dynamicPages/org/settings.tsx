import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import LeaveOrganizationSection from '../../dialogPages/global/orgSettings/LeaveOrganizationSection';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import PageTitle from '../../components/molecules/PageTitle';
import { buildStandardMainInfo } from '../../utils/InfoLabelsUtils';
import { OrgSettingsContainer } from '../../components/molecules/OrgSettingsContainer';
import { QueryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import { ProductSettings } from '../../gql/generated/ProductSettings';
import { useQuery } from '@apollo/client';
import ProductSettingsQuery from '../../gql/queries/ProductSettingsQuery';
import { Mode } from '../../gql/generated/globalTypes';
import PaymentInformationSection from '../../dialogPages/global/orgSettings/PaymentInformatonSection';
import TransferOwnershipSection from '../../dialogPages/global/orgSettings/TransferOwnershipSection';
import RemoveOrganizationSection from '../../dialogPages/global/orgSettings/RemoveOrganizationSection';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import AccountPlans from '../../components/organisms/AccountPlans';
import { useRouter } from 'next/router';
import { toOrg } from '../../utils/NavigationPaths';

const OrgSettings: FC<{ id: string; plan?: string }> = (props: { id: string; plan?: string }) => {
    const { id, plan } = props;
    const { mode } = useConfigState();

    return QueryLoaderAndError<ProductSettings>(
        true,
        useQuery<ProductSettings>(ProductSettingsQuery, {
            notifyOnNetworkStatusChange: true,
            variables: {
                id: id,
            },
        }),
        (data: ProductSettings, valuesRefresh: (mustResetCache: boolean) => void) => {
            return (
                <Box px={2} pt={0} pb={4}>
                    {mode === Mode.COMMERCIAL && (
                        <>
                            <PageTitle title="Plans" {...buildStandardMainInfo('Plans')} />
                            <OrgSettingsContainer dark>
                                <AccountPlans data={data} plan={plan} />
                            </OrgSettingsContainer>
                            <Box height={16} />
                        </>
                    )}
                    <PageTitle
                        title="Organization Settings"
                        {...buildStandardMainInfo('tagManagerPlans')}
                    />
                    <OrgSettingsContainer dark>
                        {mode === Mode.COMMERCIAL && <PaymentInformationSection data={data} />}
                        <TransferOwnershipSection valuesRefresh={valuesRefresh} data={data} />
                        <RemoveOrganizationSection data={data} valuesRefresh={valuesRefresh} />
                    </OrgSettingsContainer>
                </Box>
            );
        },
    );
};

const OrgSettingsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const orgId = props.params.id ?? '';
    const router = useRouter();
    const [plan, setPlan] = useState<string | undefined>();

    useEffect(() => {
        if (props.params.plan) {
            setPlan(props.params.plan);
            router.replace(toOrg({ id: orgId }, 'settings'), undefined, { shallow: true }).then();
        }
    }, []);

    const { orgUserState } = useLoggedInState();

    if (orgUserState && orgUserState.isOwner) return <OrgSettings id={orgId} plan={plan} />;
    return (
        <Box px={2} pt={0} pb={4}>
            <PageTitle title="Leave Organization" {...buildStandardMainInfo('tagManagerPlans')} />
            <OrgSettingsContainer dark>
                <LeaveOrganizationSection id={orgId} />
            </OrgSettingsContainer>
        </Box>
    );
};

export default OrgSettingsPage;
