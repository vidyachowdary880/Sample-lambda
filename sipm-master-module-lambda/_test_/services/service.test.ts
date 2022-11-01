import { Service } from '../../src/service';
import { Repository } from '../../src/repository';
import * as resource from '../resources/resource.json';
import { groupCreateEvent, groupUpdateEvent, groupDeleteEvent, phaseCreateEvent, phaseUpdateEvent, phaseDeleteEvent } from '../resources/gateWayEventTest.json';

describe('Group Service', () => {
    test('Service getGroupList test successful', async () => {
        let dbResult = [{
            "sortKey": "GROUP#1",
            "name": "Test Group 1"
        },
        {
            "sortKey": "GROUP#2",
            "name": "Test Group 2"
        }];
        let expectedResult = {
            groups: [{
                "id": "GROUP#1",
                "name": "Test Group 1"
            },
            {
                "id": "GROUP#2",
                "name": "Test Group 2"
            }]
        };
        Repository.getMasterRecords = jest.fn().mockReturnValue(dbResult);
        const result = await Service.getGroupList();
        expect(result).toStrictEqual(expectedResult);
    });

    test('Service createGroup test successful', async () => {
        let insertGroupResult = [{
            "sortKey": "GROUP#1",
            "name": "Test Group 1",
            "nameInLowerCase": "test group 1",
            "createdDate": new Date().toISOString(),
            "modifiedDate": new Date().toISOString()
        }];
        let getMaxIdResult = [{
            "maxIdValue": 1
        }];
        let expectedResult = {
            group: {
                "name": "Test Group 1"
            }
        };
        Repository.getMasterRecords = jest.fn().mockReturnValue([]); // check for duplicate name
        Repository.getMaxId = jest.fn().mockReturnValue(getMaxIdResult);
        Repository.updateMaxId = jest.fn().mockResolvedValue([]);
        Repository.createMaster = jest.fn().mockReturnValue(insertGroupResult);
        const result = await Service.createGroup(groupCreateEvent);
        expect(result).toStrictEqual(expectedResult);
    });

    test('Service createGroup duplicate group test successful', async () => {
        let duplicateRecord = [{
            "id": "GROUP#2",
            "name": "Test Group 1",
            "nameInLowerCase": "test group 1",
            "createdDate": new Date().toISOString(),
            "modifiedDate": new Date().toISOString()
        }];
        let expectedError = ['SIPM_GRP_ERR_006'];
        let thrownError: any;
        Repository.getMasterRecords = jest.fn().mockReturnValue(duplicateRecord); // check for duplicate name
        try {
            await Service.createGroup(groupCreateEvent);
        } catch (err) {
            thrownError = err;
        }
        expect(thrownError).toEqual(expectedError);
    });

    test('Service updateGroup test successful', async () => {
        let updateGroupResult = [{
            "name": "Test Group 1",
            "nameInLowerCase": "test group 1",
            "modifiedDate": new Date().toISOString()
        }];
        let expectedResult = {
            group: {
                "id": "GROUP#1",
                "name": "Test Group 1"
            }
        };
        Repository.getMasterRecords = jest.fn().mockReturnValue([]); // check for duplicate name
        Repository.updateMaster = jest.fn().mockReturnValue(updateGroupResult);
        const result = await Service.updateGroup(groupUpdateEvent);
        expect(result).toStrictEqual(expectedResult);
    });

    test('Service updateGroup duplicate group test successful', async () => {
        let duplicateRecord = [{
            "id": "GROUP#2",
            "name": "Test Group 1",
            "nameInLowerCase": "test group 1",
            "createdDate": new Date().toISOString(),
            "modifiedDate": new Date().toISOString()
        }];
        let expectedError = ['SIPM_GRP_ERR_006'];
        let thrownError: any;
        Repository.getMasterRecords = jest.fn().mockReturnValue(duplicateRecord); // check for duplicate name
        try {
            await Service.updateGroup(groupUpdateEvent);
        } catch (err) {
            thrownError = err;
        }
        expect(thrownError).toEqual(expectedError);
    });

    test('Service deleteGroup test successful', async () => {
        let deleteGroupResult = [{
            "partitionKey": "SIPM",
            "sortKey": "GROUP#1",
            "name": "Test Group 1",
            "nameInLowerCase": "test group 1",
            "createdDate": new Date().toISOString(),
            "modifiedDate": new Date().toISOString()
        }];
        let expectedResult = {
            group: {
                "id": "GROUP#1"
            }
        };
        Repository.deleteMaster = jest.fn().mockReturnValue(deleteGroupResult);
        const result = await Service.deleteGroup(groupDeleteEvent);
        expect(result).toStrictEqual(expectedResult);
    });

    test('Service deleteGroup no record test successful', async () => {
        let expectedError = ['SIPM_GRP_INF_001'];
        let thrownError: any;
        Repository.deleteMaster = jest.fn().mockReturnValue(null);
        try {
            await Service.deleteGroup(groupDeleteEvent);
        } catch (err) {
            thrownError = err;
            expect(thrownError).toStrictEqual(expectedError);
        }
    });
});

describe('Phase Service', () => {
    test('Service getPhaseList test successful', async () => {
        let dbResult = [{
            "sortKey": "PHASE#1",
            "name": "Test Phase 1"
        },
        {
            "sortKey": "PHASE#2",
            "name": "Test Phase 2"
        }];
        let expectedResult = {
            phases: [{
                "id": "PHASE#1",
                "name": "Test Phase 1"
            },
            {
                "id": "PHASE#2",
                "name": "Test Phase 2"
            }]
        };
        Repository.getMasterRecords = jest.fn().mockReturnValue(dbResult);
        const result = await Service.getPhaseList();
        expect(result).toStrictEqual(expectedResult);
    });
    test('Service createPhase test successful', async () => {
        let insertPhaseResult = [{
            "sortKey": "PHASE#1",
            "name": "Test Phase 1",
            "nameInLowerCase": "test phase 1",
            "createdDate": new Date().toISOString(),
            "modifiedDate": new Date().toISOString()
        }];
        let getMaxIdResult = [{
            "MaxIdValue": 1
        }]
        let expectedResult = {
            phase: {
                "name": "Test Phase 1"
            }
        };
        Repository.getMasterRecords = jest.fn().mockReturnValue([]);
        Repository.getMaxId = jest.fn().mockReturnValue(getMaxIdResult);
        Repository.updateMaxId = jest.fn().mockResolvedValue([]);
        Repository.createMaster = jest.fn().mockReturnValue(insertPhaseResult);
        const result = await Service.createPhase(phaseCreateEvent);
        expect(result).toStrictEqual(expectedResult);
    });

    test('Service createPhase duplicate phase test successful', async () => {
        let duplicateRecord = [{
            "id": "PHASE#2",
            "name": "Test Phase 1",
            "nameInLowerCase": "test phase 1",
            "createdDate": new Date().toISOString(),
            "modifiedDate": new Date().toISOString()
        }];
        let expectedError = ['SIPM_PHS_ERR_006'];
        let thrownError: any;
        Repository.getMasterRecords = jest.fn().mockReturnValue(duplicateRecord); // check for duplicate name
        try {
            await Service.createPhase(phaseCreateEvent);
        } catch (err) {
            thrownError = err;
        }
        expect(thrownError).toEqual(expectedError);
    });

    test('Service updatePhase test successful', async () => {
        let updatePhaseResult = [{
            "name": "Test Phase 1",
            "nameInLowerCase": "test phase 1",
            "modifiedDate": new Date().toISOString()
        }];
        let expectedResult = {
            phase: {
                "id": "PHASE#1",
                "name": "Test Phase 1"
            }
        };
        Repository.getMasterRecords = jest.fn().mockReturnValue([]); // check for duplicate name
        Repository.updateMaster = jest.fn().mockReturnValue(updatePhaseResult);
        const result = await Service.updatePhase(phaseUpdateEvent);
        expect(result).toStrictEqual(expectedResult);
    });

    test('Service updatePhase duplicate phase test successful', async () => {
        let duplicateRecord = [{
            "id": "PHASE#2",
            "name": "Test Phase 1",
            "nameInLowerCase": "test phase 1",
            "createdDate": new Date().toISOString(),
            "modifiedDate": new Date().toISOString()
        }];
        let expectedError = ['SIPM_PHS_ERR_006'];
        let thrownError: any;
        Repository.getMasterRecords = jest.fn().mockReturnValue(duplicateRecord); // check for duplicate name
        try {
            await Service.updatePhase(phaseUpdateEvent);
        } catch (err) {
            thrownError = err;
        }
        expect(thrownError).toEqual(expectedError);
    });

    test('Service deletePhase test successful', async () => {
        let deletePhaseResult = [{
            "partitionKey": "SIPM",
            "sortKey": "PHASE#1",
            "name": "Test Phase 1",
            "nameInLowerCase": "test phase 1",
            "createdDate": new Date().toISOString(),
            "modifiedDate": new Date().toISOString()
        }];
        let expectedResult = {
            phase: {
                "id": "PHASE#1"
            }
        };
        Repository.deleteMaster = jest.fn().mockReturnValue(deletePhaseResult);
        const result = await Service.deletePhase(phaseDeleteEvent);
        expect(result).toStrictEqual(expectedResult);
    });

    test('Service deletePhase no record test successful', async () => {
        let expectedError = ['SIPM_PHS_INF_001'];
        let thrownError: any;
        Repository.deleteMaster = jest.fn().mockReturnValue(null);
        try {
            await Service.deletePhase(phaseDeleteEvent);
        } catch (err) {
            thrownError = err;
            expect(thrownError).toStrictEqual(expectedError);
        }
    });


    test('Service deleteorg test successful', async () => {
        let deleteResult = [{
            "emailId": "as@gmail.com"
        }];

        Repository.queryOrganizationRecords = jest.fn().mockReturnValue(deleteResult);
        Repository.batchDelete = jest.fn().mockReturnValue({});
        await Service.deleteOrganization(resource.deleteEvent);

    })

    test('Service createorg test successful', async () => {


        Repository.getOrgRecord = jest.fn().mockReturnValue(null);
        Repository.batchInsert = jest.fn().mockReturnValue({});
        await Service.createOrganizationRecord(resource.createOrgEvent);

    })


    test('Service createorg test error', async () => {
        let orgResult = [{
            "emailId": "as@gmail.com"
        }];


        Repository.getOrgRecord = jest.fn().mockReturnValue(orgResult);
        try {
            await Service.createOrganizationRecord(resource.createOrgEvent);
        }
        catch (e) {

        }

    })

    test('Service getorgRecord test  ', async () => {
        let orgResult = [{
            "sortKey": "ORG#RICHMOND_UNIVERSITY#USER#vidya@gmail.com",
            "emailId": "as@gmail.com"
        },
        {
            "sortKey": "ORG#RICHMOND_UNIVERSITY",
            "organizationName": "richmiond university"
        }];


        Repository.queryOrganizationRecords = jest.fn().mockReturnValue(orgResult);
        await Service.getOrganizationService(resource.event);

    })
    test('Service getorgRecord test error ', async () => {
        let orgResult = [];


        Repository.queryOrganizationRecords = jest.fn().mockReturnValue(orgResult);
        try {
            await Service.getOrganizationService(resource.event);
        }
        catch (e) {

        }

    })


    test('Service updateOrgResult test', async () => {


        Repository.updateOrganization = jest.fn().mockReturnValue(null);
        Repository.batchInsert = jest.fn().mockReturnValue(null);
        Repository.batchDelete = jest.fn().mockReturnValue(null);
        await Service.updateOrganization(resource.updateOrgEvent);



    })

    test('Service updateOrgResult test error', async () => {


        Repository.updateOrganization = jest.fn().mockReturnValue(null);
        try {
            await Service.updateOrganization(resource.updateOrgEventError);
        } catch (e) {

        }



    })

    test('Service getOrgResult test', async () => {


        Repository.queryOrganizationList = jest.fn().mockReturnValue({});
        Promise.all = jest.fn().mockReturnValue(null);
        await Service.getOrganizationList();

    })


});