import { FC } from 'react';
import { Box, Button, useTheme } from '@material-ui/core';
import DangerBox from '../../../components/molecules/DangerBox';
import { PageActionProps, pageActions } from '../../../actions/PageActions';
import { Mode } from '../../../gql/generated/globalTypes';
import { useConfigState, useLoggedInState } from '../../../context/AppContext';
import { OrgSettingsSectionProps } from '../../../types/props/OrgSettingsSectionProps';

type TransferOwnershipSectionProps = OrgSettingsSectionProps & {
    valuesRefresh: (mustResetCache: boolean) => void;
};

const TransferOwnershipSection: FC<TransferOwnershipSectionProps> = (
    props: TransferOwnershipSectionProps,
) => {
    const theme = useTheme();
    const { mode } = useConfigState();
    const { templateInteractions, orgUserState } = useLoggedInState();
    const { ask, dispatchDialogAction } = templateInteractions;
    const { valuesRefresh, data } = props;

    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
        refresh: () => {
            valuesRefresh(true);
        },
    };

    if (orgUserState === null) {
        return null;
    }

    return (
        <>
            <DangerBox>
                Transferring the ownership of the organization you will{' '}
                <b>loose access to settings{mode === Mode.COMMERCIAL && ' and billing'}</b>.
                <Box py={3}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            ask(
                                `Do you want to transfer the ownership of the organization: ${orgUserState.orgName}?`,
                                () => {
                                    pageActions.transferOwnership(pageActionProps, data.getOrg.id);
                                },
                            );
                        }}
                        style={{
                            color: '#ffffff',
                            backgroundColor: theme.palette.error.main,
                        }}
                        disableElevation
                    >
                        Transfer Ownership
                    </Button>
                </Box>
            </DangerBox>
            <Box height={32} />
        </>
    );
};

export default TransferOwnershipSection;
