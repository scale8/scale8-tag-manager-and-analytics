import { FC } from 'react';
import { AccountProduct } from '../../../gql/generated/globalTypes';
import { PageActionProps, pageActions } from '../../../actions/PageActions';
import { AccountSectionButton } from '../../../components/molecules/AccountSectionButton';
import {
    OrgDashboardPageData_getOrg_data_manager_account,
    OrgDashboardPageData_getOrg_tag_manager_account,
} from '../../../gql/generated/OrgDashboardPageData';
import {
    appGroupingCountToSparkData,
    groupingCountToSparkData,
} from '../../../utils/SparkDataUtils';
import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useLoggedInState } from '../../../context/AppContext';
import { OrgDashboardProps } from '../../../types/props/OrgDashboardProps';
import { AccountSectionAppTable } from '../../../components/molecules/Tables/AccountSectionAppTable';
import { AccountSectionEndpointTable } from '../../../components/molecules/Tables/AccountSectionEndpointTable';
import { useRouter } from 'next/router';
import { toOrg } from '../../../utils/NavigationPaths';
import Link from '../../../components/atoms/Next/Link';

export type OrgAccountSectionProps = OrgDashboardProps & {
    accountProduct: AccountProduct;
};

const OrgAccountSection: FC<OrgAccountSectionProps> = (props: OrgAccountSectionProps) => {
    const { data, accountProduct } = props;
    const { orgUserState, templateInteractions } = useLoggedInState();
    const { dispatchDialogAction, setRefreshCurrentSection } = templateInteractions;
    const router = useRouter();
    const isTag = accountProduct === AccountProduct.TAG_MANAGER;
    const isOwner = orgUserState !== null && orgUserState.isOwner;
    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
        refresh: () => {
            setRefreshCurrentSection(true);
        },
    };

    const account = isTag ? data.getOrg.tag_manager_account : data.getOrg.data_manager_account;

    if (account === null) {
        const canCreate = isTag
            ? data.getOrg.me.can_create_tag_manager_trial
            : data.getOrg.me.can_create_data_manager_trial;
        if (canCreate && isOwner) {
            return (
                <AccountSectionButton
                    clickAction={
                        isTag
                            ? () =>
                                  pageActions.startTagManagerTrial(pageActionProps, data.getOrg.id)
                            : () =>
                                  pageActions.startDataManagerTrial(pageActionProps, data.getOrg.id)
                    }
                    text="Start Your Free Trial"
                    isOwner={isOwner}
                    isTag={isTag}
                    tooltip={
                        isOwner
                            ? 'Activate free trial'
                            : 'Only the organization owner can activate a free trial'
                    }
                />
            );
        } else {
            return (
                <AccountSectionButton
                    clickAction={() => {
                        router.push(toOrg({ id: data.getOrg.id }, 'settings')).then();
                    }}
                    text="Select Plan"
                    isOwner={isOwner}
                    isTag={isTag}
                    tooltip={
                        isOwner
                            ? 'Go to settings to select a plan'
                            : 'Only the organization owner can change the account plans'
                    }
                />
            );
        }
    }

    if (account.trial_expired) {
        return (
            <AccountSectionButton
                clickAction={() => {
                    router.push(toOrg({ id: data.getOrg.id }, 'settings')).then();
                }}
                text="Select Plan"
                isOwner={isOwner}
                isTag={isTag}
                tooltip={
                    isOwner
                        ? 'Go to settings to select a plan'
                        : 'Only the organization owner can change the account plans'
                }
            />
        );
    }

    const trialInfo = account.is_trial ? (
        <Box width="100%" mb={2}>
            <Alert severity="info">
                You have <b>{account.trial_expires_in}</b> days left in your free trial.
                <Link href={toOrg({ id: data.getOrg.id }, 'settings')} sx={{ color: '#1b1b1b' }}>
                    Upgrade to a paid plan
                </Link>
                .
            </Alert>
        </Box>
    ) : null;

    if (isTag) {
        return (
            <>
                {trialInfo}
                <AccountSectionAppTable
                    applications={(
                        account as OrgDashboardPageData_getOrg_tag_manager_account
                    ).apps.map((_) => ({
                        id: _.id,
                        name: _.name,
                        pageViews: appGroupingCountToSparkData(
                            _.event_request_stats.from as number,
                            _.event_request_stats.to as number,
                            _.event_request_stats.result,
                        ),
                    }))}
                    tmId={account.id}
                />
            </>
        );
    } else {
        return (
            <>
                {trialInfo}
                <AccountSectionEndpointTable
                    endpoints={(
                        account as OrgDashboardPageData_getOrg_data_manager_account
                    ).ingest_endpoints.map((_) => ({
                        id: _.id,
                        name: _.name,
                        bytes: groupingCountToSparkData(
                            _.byte_stats.from as number,
                            _.byte_stats.to as number,
                            _.byte_stats.result,
                        ),
                        requests: groupingCountToSparkData(
                            _.request_stats.from as number,
                            _.request_stats.to as number,
                            _.request_stats.result,
                        ),
                    }))}
                    dmId={account.id}
                />
            </>
        );
    }
};

export default OrgAccountSection;
