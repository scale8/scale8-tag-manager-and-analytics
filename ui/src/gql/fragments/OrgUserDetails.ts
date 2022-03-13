import { gql } from '@apollo/client';

export const OrgUserDetails = gql`
    fragment orgUserDetails on Org {
        id
        name
        tag_manager_account {
            id
            trial_expires_in
            is_trial
        }
        data_manager_account {
            id
            trial_expires_in
            is_trial
        }
        me {
            id
            permissions {
                can_view
                can_create
                can_edit
                can_delete
                is_admin
            }
            owner
        }
    }
`;
