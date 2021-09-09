import Repo from '../../abstractions/Repo';
import { injectable } from 'inversify';
import { IndexSpecification } from 'mongodb';
import IngestEndpoint from '../../models/data/IngestEndpoint';

@injectable()
export default class IngestEndpointRepo extends Repo<IngestEndpoint> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexSpecification[] = [
        {
            background: false,
            key: {
                _data_manager_account_id: 1,
            },
        },
    ];
}
