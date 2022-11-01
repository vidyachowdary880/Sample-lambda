import { DataMapper } from '@aws/dynamodb-data-mapper'
import { Repository } from "../../src/repository";
jest.mock('../../src/entities/master');
jest.mock('../../src/entities/maxIdValue');
import { Master } from '../../src/entities/master';
import { MaxIdValue } from '../../src/entities/maxIdValue';

const createMasterObject = new Master();
createMasterObject.name = 'Test Group 1';
createMasterObject.partitionKey = 'GROUP#1';
createMasterObject.nameInLowerCase = 'test group 1';

const createMasterResultObject = {
  Master: [{
    name: 'Test Group 1',
    partitionKey: 'GROUP#1',
    nameInLowerCase: 'test group 1',
    createdDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString()
  }]
}

const deleteMasterObject = new Master();
createMasterObject.partitionKey = 'GROUP#1';

const deleteMasterResultObject = {
  Master: [{
    name: 'Test Group 1',
    partitionKey: 'GROUP#1',
    nameInLowerCase: 'test group 1',
    createdDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString()
  }]
}

const getMasterListResult = [{
  name: 'Test Group 1',
  partitionKey: 'GROUP#1',
  nameInLowerCase: 'test group 1',
  createdDate: new Date().toISOString(),
  modifiedDate: new Date().toISOString()
},
{
  name: 'Test Group 2',
  partitionKey: 'GROUP#2',
  nameInLowerCase: 'test group 2',
  createdDate: new Date().toISOString(),
  modifiedDate: new Date().toISOString()
}]

const updateMaxIdObject = new MaxIdValue();
updateMaxIdObject.maxIdValue = 1;

const updateMaxIdResultObject = new MaxIdValue();
updateMaxIdResultObject.maxIdValue = 1;
updateMaxIdResultObject.entity = 'GROUP';
updateMaxIdResultObject.partitionKey = 'SIPM';

describe('Repository success test', () => {
  beforeEach(() => {
    jest.spyOn(DataMapper.prototype, 'update').mockResolvedValue(updateMaxIdResultObject);
    jest.spyOn(DataMapper.prototype, 'put').mockResolvedValue(createMasterResultObject);
    jest.spyOn(DataMapper.prototype, 'delete').mockResolvedValue(deleteMasterResultObject);
    DataMapper.prototype.query = jest.fn().mockReturnValue(getMasterListResult);
  })

  test('Repository updateMaxId test successful', async () => {
    let result = await Repository.updateMaxId(updateMaxIdObject);
    expect(result).toEqual(updateMaxIdResultObject)
  });
  test('Repository createMaster test successful', async () => {
    let result = await Repository.createMaster(createMasterObject, {});
    expect(result).toEqual(createMasterResultObject)
  });
  test('Repository deleteMaster test successful', async () => {
    let result = await Repository.deleteMaster(deleteMasterObject);
    expect(result).toEqual(deleteMasterResultObject)
  });
  test('Repository getMaster test successful', async () => {
    let result = await Repository.getMasterRecords(Master, {}, {});
    expect(result).toEqual(getMasterListResult)
  });

  afterEach(() => {
    jest.restoreAllMocks()
  })
})

describe('Repository error test', () => {
  beforeEach(() => {
    jest.spyOn(DataMapper.prototype, 'put').mockRejectedValue(['SIPM_GEN_ERR_001']);
    jest.spyOn(DataMapper.prototype, 'update').mockRejectedValue(['SIPM_GEN_ERR_001']);
    jest.spyOn(DataMapper.prototype, 'delete').mockRejectedValue(['SIPM_GEN_ERR_001']);
    DataMapper.prototype.query = jest.fn().mockRejectedValue(['SIPM_GEN_ERR_001']);
  })

  test('Repository updateMaxId error test successful', async () => {
    let thrownError: any;
    try {
      await Repository.updateMaxId(updateMaxIdObject);
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toEqual(['SIPM_GEN_ERR_001']);
  });
  test('Repository createMaster error test successful', async () => {
    let thrownError: any;
    try {
      await Repository.createMaster(createMasterObject, {});
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toEqual(['SIPM_GEN_ERR_001']);
  });

  test('Repository deleteMaster error test successful', async () => {
    let thrownError: any;
    try {
      await Repository.deleteMaster(deleteMasterObject);
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toEqual(['SIPM_GEN_ERR_001']);
  });

  test('Repository getMaster error test successful', async () => {
    let thrownError: any;
    try {
      await Repository.getMasterRecords(Master, {}, {});
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toEqual(['SIPM_GEN_ERR_001']);
  });

  afterEach(() => {
    jest.restoreAllMocks()
  })
})