import 'reflect-metadata';
import { Collection, FindCursor } from 'mongodb';
import TestUtils from '../../../utils/TestUtils';
import Model from '../../../../src/mongo/abstractions/Model';
import Repo from '../../../../src/mongo/abstractions/Repo';
import ModelFromRepoFactory from '../../../../src/container/factoryTypes/ModelFromRepoFactory';
import FieldProps from '../../../../src/mongo/interfaces/FieldProps';
import Shell from '../../../../src/mongo/database/Shell';
import container from '../../../../src/container/IOC.config';
import TYPES from '../../../../src/container/IOC.types';
import Mock = jest.Mock;

describe('Abstract Repo', () => {
    const mockShell = {} as Shell;
    const mockCollection = {} as Collection;
    const mockCursor = {} as FindCursor;

    beforeEach(TestUtils.beforeEachPrepareContainerAndDate);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    class TestModel extends Model {}
    class TestRepo extends Repo<TestModel> {}

    const bindModelRepo = (): Repo<TestModel> => {
        TestUtils.mockLogger.database = jest.fn();
        mockShell.getCollection = jest.fn(() => mockCollection) as Mock;
        container.rebind(TYPES.Shell).toConstantValue(mockShell);
        const mockModelFromRepoFactory: ModelFromRepoFactory = () => TestModel as any;
        container.rebind(TYPES.ModelFromRepoFactory).toConstantValue(mockModelFromRepoFactory);

        container.bind('testRepo').to(TestRepo).inSingletonScope();

        const modelRepo = container.get<TestRepo>('testRepo');
        modelRepo.getMapping = jest.fn();
        return modelRepo;
    };

    it('should fetch a model with findOne', async () => {
        const modelRepo = bindModelRepo();
        (modelRepo.getMapping as Mock).mockReturnValueOnce(
            new Map<string, FieldProps<TestModel>>([['_id', {}]]),
        );
        mockCollection.find = jest.fn(() => mockCursor) as Mock;
        mockCursor.sort = jest.fn(() => mockCursor) as Mock;
        mockCursor.skip = jest.fn(() => mockCursor) as Mock;
        mockCursor.limit = jest.fn(() => mockCursor) as Mock;
        mockCursor.toArray = jest.fn().mockReturnValueOnce([
            {
                _id: 'dbValue',
            },
        ]);
        const query = {
            _id: 'dbValue',
        };
        const returnValue = await modelRepo.findOne(query);
        expect(returnValue).toBeInstanceOf(TestModel);
        expect(returnValue ? returnValue.id : null).toBe('dbValue');
        // check default filter applied
        expect(mockCollection.find).toHaveBeenCalledWith({
            ...query,
            _is_deleted: {
                $eq: false,
            },
        });
    });
});
