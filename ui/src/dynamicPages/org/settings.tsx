import { FC } from 'react';
import { Box } from '@material-ui/core';
import LeaveOrganizationSection from '../../dialogPages/global/orgSettings/LeaveOrganizationSection';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import PageTitle from '../../components/molecules/PageTitle';
import { buildStandardMainInfo } from '../../utils/InfoLabelsUtils';
import { OrgSettingsContainer } from '../../components/molecules/OrgSettingsContainer';
import { queryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import { ProductSettings } from '../../gql/generated/ProductSettings';
import { useQuery } from '@apollo/client';
import ProductSettingsQuery from '../../gql/queries/ProductSettingsQuery';
import { AccountProduct, Mode } from '../../gql/generated/globalTypes';
import ProductList from '../../dialogPages/global/orgSettings/ProductList';
import UnsubscribeSection from '../../dialogPages/global/orgSettings/UnsubscribeSection';
import PaymentInformationSection from '../../dialogPages/global/orgSettings/PaymentInformatonSection';
import TransferOwnershipSection from '../../dialogPages/global/orgSettings/TransferOwnershipSection';
import RemoveOrganizationSection from '../../dialogPages/global/orgSettings/RemoveOrganizationSection';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';

const OrgSettings: FC<{ id: string }> = (props: { id: string }) => {
    const { id } = props;
    const { mode } = useConfigState();

    return queryLoaderAndError<ProductSettings>(
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
                            <PageTitle
                                title="Tag Manager Plans"
                                {...buildStandardMainInfo('tagManagerPlans')}
                            />
                            <OrgSettingsContainer dark>
                                <ProductList
                                    data={data}
                                    accountProduct={AccountProduct.TAG_MANAGER}
                                    valuesRefresh={valuesRefresh}
                                />
                                <UnsubscribeSection
                                    data={data}
                                    accountProduct={AccountProduct.TAG_MANAGER}
                                    valuesRefresh={valuesRefresh}
                                />
                            </OrgSettingsContainer>
                            <Box height={16} />
                            <PageTitle
                                title="Data Manager Plans"
                                {...buildStandardMainInfo('tagManagerPlans')}
                            />
                            <OrgSettingsContainer dark>
                                <ProductList
                                    data={data}
                                    accountProduct={AccountProduct.DATA_MANAGER}
                                    valuesRefresh={valuesRefresh}
                                />
                                <UnsubscribeSection
                                    data={data}
                                    accountProduct={AccountProduct.DATA_MANAGER}
                                    valuesRefresh={valuesRefresh}
                                />
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

    const { orgUserState } = useLoggedInState();

    if (orgUserState && orgUserState.isOwner) return <OrgSettings id={orgId} />;
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
