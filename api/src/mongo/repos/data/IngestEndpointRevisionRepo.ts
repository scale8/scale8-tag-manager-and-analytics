import Repo from '../../abstractions/Repo';
import { injectable } from 'inversify';
import { IndexSpecification } from 'mongodb';
import IngestEndpointRevision from '../../models/data/IngestEndpointRevision';

@injectable()
export default class IngestEndpointRevisionRepo extends Repo<IngestEndpointRevision> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexSpecification[] = [
        {
            background: false,
            key: {
                _ingest_endpoint_id: 1,
            },
        },
        {
            background: false,
            key: {
                ___persisting_id: 1,
                _id: 1,
            },
            unique: true,
        },
    ];
}
