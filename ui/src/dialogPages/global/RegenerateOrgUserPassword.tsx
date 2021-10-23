import { FC } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import RegenerateOrgUserPasswordQuery from '../../gql/mutations/RegenerateOrgUserPasswordQuery';
import InfoDialogTitle from '../../components/molecules/InfoDialogTitle';
import { Box, DialogContent, DialogContentText, Typography } from '@mui/material';
import CopyBlock from '../../components/atoms/CopyBlock';
import {
    DialogDirectMutation,
    DialogMutationFunction,
    RenderDataProps,
} from '../abstractions/DialogDirectMutation';

const DisplayNewPassword: FC<RenderDataProps> = (props: RenderDataProps) => {
    const newPassword = props.data.regenerateUserPassword;

    if (newPassword === null) {
        return null;
    } else {
        return (
            <>
                <InfoDialogTitle handleDialogClose={props.handleDialogClose}>
                    {props.name === '' ? 'Password for new user' : `New Password for ${props.name}`}
                </InfoDialogTitle>
                <DialogContent
                    sx={{
                        margin: 0,
                        padding: 0,
                    }}
                    dividers
                >
                    <Box minWidth={500}>
                        <DialogContent>
                            <DialogContentText component="div" id="alert-dialog-description">
                                <Typography>
                                    {props.name === ''
                                        ? 'The password for new user is:'
                                        : `The new password for ${props.name} is:`}
                                </Typography>
                                <Typography>
                                    <Box fontSize={12} my={1}>
                                        <CopyBlock text={newPassword} language="html" />
                                    </Box>
                                </Typography>
                            </DialogContentText>
                        </DialogContent>
                    </Box>
                </DialogContent>
            </>
        );
    }
};

const RegenerateOrgUserPassword: FC<DialogPageProps> = (props: DialogPageProps) => {
    return (
        <DialogDirectMutation
            executeMutationCallback={async (
                mutationFunction: DialogMutationFunction,
                id: string,
                contextId: string,
            ) => {
                await mutationFunction({
                    variables: { regenerateUserPasswordInput: { user_id: id, org_id: contextId } },
                });
            }}
            mutation={RegenerateOrgUserPasswordQuery}
            {...props}
            renderData={DisplayNewPassword}
            pageRefresh={() => {
                // No need to refresh
            }}
        />
    );
};

export { RegenerateOrgUserPassword };
