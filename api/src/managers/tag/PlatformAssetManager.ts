import { injectable } from 'inversify';
import Manager from '../../abstractions/Manager';
import { gql } from 'apollo-server-express';
import PlatformAsset from '../../mongo/models/tag/PlatformAsset';

@injectable()
export default class PlatformAssetManager extends Manager<PlatformAsset> {
    protected gqlSchema = gql`
        """
        @model
        """
        type PlatformAsset {
            """
            ID of the \`PlatformAsset\`
            """
            id: ID!
            """
            Persisting ID, this reference will stay the same across all revisions of this entity
            """
            persisting_id: String!
            """
            Name of the \`PlatformAsset\`
            """
            name: String!
            """
            Asset mime-type
            """
            mime_type: String!
            """
            Size of asset in bytes
            """
            size: Int!
        }
    `;
}
