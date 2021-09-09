import 'reflect-metadata';
import container from '../../../src/container/IOC.config';
import TYPES from '../../../src/container/IOC.types';
import { ChainedDependency } from '../../../src/container/ChainDependenciesBinder';
import TestUtils from '../../utils/TestUtils';

describe('ChainDependenciesBinder', () => {
    beforeEach(TestUtils.beforeEachPrepareContainerAndDate);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    it('should bind all the dependencies', async () => {
        container
            .get<ChainedDependency[]>(TYPES.ChainedDependencies)
            .forEach((chainedDependency: ChainedDependency) => {
                const { manager, repository, model } = chainedDependency;
                const repo = container.get(repository.id);
                expect((repo as any)['model']).toEqual(model);
                const repoFromManager = manager ? (container.get(manager.id) as any)['repo'] : null;
                expect(repoFromManager).toEqual(manager ? repo : null);
            });
    });
});
