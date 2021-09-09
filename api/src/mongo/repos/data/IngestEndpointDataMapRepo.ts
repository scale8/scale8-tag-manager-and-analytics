import { injectable } from 'inversify';
import IngestEndpointDataMap from '../../models/data/IngestEndpointDataMap';
import UnderIngestEndpointRevisionControl from './abstractions/UnderIngestEndpointRevisionControl';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class IngestEndpointDataMapRepo extends UnderIngestEndpointRevisionControl<IngestEndpointDataMap> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexSpecification[] = [
        {
            background: false,
            key: {
                ___persisting_id: 1,
                _revision_id: 1,
            },
            unique: true,
        },
    ];
}
