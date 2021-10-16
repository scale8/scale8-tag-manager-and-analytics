import { FC } from 'react';
import { Box, Button, useTheme } from '@mui/material';
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
    const theme = useTheme();
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
            <DangerBox>
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
                        style={{
                            color: '#ffffff',
                            backgroundColor: theme.palette.error.main,
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
