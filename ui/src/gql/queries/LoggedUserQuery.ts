import { gql } from '@apollo/client';

const LoggedUserQuery = gql`
    query LoggedUser {
        me {
            id
            first_name
            last_name
            email
            invites {
                id
                org {
                    id
                    name
                }
            }
            user_notifications {
                id
                type
                is_viewed
            }
            is_admin
            api_token
            two_factor_auth
            email_notifications
            github_user
            github_connected
        }
        config {
            is_configured
            mode
            use_signup
            use_email
            use_github_sso
            use_two_factor_auth
            is_audit_enabled
            consent_purposes {
                id
                name
            }
            consent_vendors {
                id
                name
            }
            tag_manager_products {
                id
                name
                amount
                page_views
            }
            data_manager_products {
                id
                name
                amount
                requests
                gbs
            }
        }
    }
`;

export default LoggedUserQuery;
