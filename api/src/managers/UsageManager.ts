import Manager from '../abstractions/Manager';
import { injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import Usage from '../mongo/models/Usage';

@injectable()
export default class UsageManager extends Manager<Usage> {
    protected gqlSchema = gql`
        """
        @model
        Metrics to describe the \`Usage\` of an account.
        """
        type Usage {
            """
            The type account the \`Usage\` is calculated for
            """
            usage_entity: String!
            """
            The id of the account the \`Usage\` is calculated for
            """
            usage_entity_id: ID!
            """
            The day the \`Usage\` metrics are referring to
            """
            day: DateTime!
            """
            The total number of requests
            """
            requests: Float!
            """
            The bytes of data transferred
            """
            bytes: Float!
        }
    `;
}
