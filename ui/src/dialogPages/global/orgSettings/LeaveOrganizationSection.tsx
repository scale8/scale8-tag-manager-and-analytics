import { FC } from 'react';
import { Box, Button } from '@mui/material';
import { PageActionProps, pageActions } from '../../../actions/PageActions';
import { useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { toOrgList } from '../../../utils/NavigationPaths';

const LeaveOrganizationSection: FC<{ id: string }> = (props: { id: string }) => {
    const { id } = props;
    const router = useRouter();
    const { templateInteractions, orgUserState } = useLoggedInState();
    const { dispatchDialogAction, ask } = templateInteractions;

    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
        refresh: () => {
            router.push(toOrgList).then();
        },
    };

    if (orgUserState === null) {
        return null;
    }

    return (
        <>
            If you leave the organization you will need an invite from an admin to join again.
            <Box pt={3}>
                <Button
                    variant="contained"
                    onClick={() => {
                        ask(`Leave organization: ${orgUserState.orgName}?`, () => {
                            pageActions.removeMe(pageActionProps, id);
                        });
                    }}
                    sx={{
                        color: '#ffffff',
                        backgroundColor: (theme) => theme.palette.error.main,
                    }}
                    disableElevation
                >
                    Leave Organization
                </Button>
            </Box>
        </>
    );
};

export default LeaveOrganizationSection;
