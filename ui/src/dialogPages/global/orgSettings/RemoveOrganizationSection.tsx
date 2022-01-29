import { FC } from 'react';
import { Box, Button } from '@mui/material';
import DangerBox from '../../../components/molecules/DangerBox';
import { PageActionProps, pageActions } from '../../../actions/PageActions';
import { Mode } from '../../../gql/generated/globalTypes';
import { useConfigState, useLoggedInState } from '../../../context/AppContext';
import { OrgSettingsSectionProps } from '../../../types/props/OrgSettingsSectionProps';

export type RemoveOrganizationSectionProps = OrgSettingsSectionProps & {
    valuesRefresh: (mustResetCache: boolean) => void;
};

const RemoveOrganizationSection: FC<RemoveOrganizationSectionProps> = (
    props: RemoveOrganizationSectionProps,
) => {
    const { data, valuesRefresh } = props;
    const { mode } = useConfigState();
    const { templateInteractions, orgUserState } = useLoggedInState();
    const { ask, dispatchDialogAction } = templateInteractions;

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
            <DangerBox dark>
                Organization removal cannot be undone. Please be certain.
                <br />
                All data{mode === Mode.COMMERCIAL && ' and subscriptions'} will be removed.
                <Box py={3}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            ask(`Delete Organization: ${orgUserState.orgName}?`, () => {
                                pageActions.deleteOrganization(pageActionProps, data.getOrg.id);
                            });
                        }}
                        sx={{
                            color: '#ffffff',
                            backgroundColor: (theme) => theme.palette.error.main,
                        }}
                        disableElevation
                    >
                        Delete Organization
                    </Button>
                </Box>
            </DangerBox>
        </>
    );
};

export default RemoveOrganizationSection;
