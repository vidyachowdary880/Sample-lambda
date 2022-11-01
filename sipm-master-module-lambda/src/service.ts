import { Master } from "./entities/master";
import { Organization } from "./entities/organization";
import { Repository } from "./repository";
import * as transformer from "node-json-transform";
import { masterTransformData, organizationResponseData, userData } from "./objectMapper";
import { log } from './handler';
import { User } from "./dto/User"
import { GROUP_ENTITY, GROUP_ID_PREFIX, PARTITION_KEY, PHASE_ENTITY, PHASE_ID_PREFIX } from "./constants";
import { attributeNotExists, beginsWith, equals } from "@aws/dynamodb-expressions";
import { MaxIdValue } from "./entities/maxIdValue";
import { Util } from './util';

const ORG_DELIMITER = "ORG#";
const USER_DELIMITER = "#USER#";
export class Service {

  /**
   * To fetch a record from the db
   * @param event 
   */
  public static async getGroupList() {
    log.debug("service :: getGroupList :: Begins");
    const keyCondition = { partitionKey: PARTITION_KEY, sortKey: beginsWith(GROUP_ID_PREFIX) };
    const queryOptions = {};
    let result = await Repository.getMasterRecords(Master, keyCondition, queryOptions);
    result = transformer.transform(result, masterTransformData);
    result.sort((a, b) => a.name.localeCompare(b.name));
    return { groups: result };
  }

  /**
   * To create a new group
   * @param event 
   */
  public static async createGroup(event: any) {
    log.debug("service :: createGroup :: Begins");
    const group = new Master();
    // trims the white spaces at the ends and removes all multiple white spaces in between
    const groupName = event.body.group.name.replace(/\s+/g, ' ').trim();
    // to check if group with the same name exists
    const duplicateRecord = await this.checkForDuplicateName(groupName, GROUP_ID_PREFIX);
    if (duplicateRecord && duplicateRecord.length > 0) {
      log.error("service :: createGroup :: Error", 'Group Exists');
      throw (['SIPM_GRP_ERR_006']);
    }
    const maxIdValue = await this.getMaxIdOfEntity(GROUP_ENTITY);
    group.sortKey = `${GROUP_ID_PREFIX}${maxIdValue}`;
    group.name = groupName;
    group.nameInLowerCase = groupName.toLocaleLowerCase(); // to compare the group name case insensitively
    const conditionExpression = { condition: { ...attributeNotExists(), subject: 'sortKey' } };
    await Repository.createMaster(group, conditionExpression);
    let result = event.body;
    return result;
  }

  /**
   * To update a record in the db
   * @param event 
   */
  public static async updateGroup(event: any) {
    log.debug("service :: updateGroup :: Begins");
    // TODO: Update only if there are no active dependent entities
    // trims the white spaces at the ends and removes all multiple white spaces in between
    const groupName = event.body.group.name.replace(/\s+/g, ' ').trim();
    // to check if group with the same name already exists
    const duplicateRecord = await this.checkForDuplicateName(groupName, GROUP_ID_PREFIX);
    if (duplicateRecord && duplicateRecord.length > 0) {
      log.error("service :: updateGroup :: Error", 'Group Exists');
      throw (['SIPM_GRP_ERR_006']);
    }
    const params = this.createParamsForMasterUpdate(event.body.group.id, groupName);
    await Repository.updateMaster(params);
    log.debug("service :: updateGroup ::success");
    let result = event.body;
    return result;
  }

  /**
   * To delete a record from the db
   * @param event 
   */
  public static async deleteGroup(event: any) {
    log.debug("service :: deleteGroup :: Begins");
    const group = new Master();
    group.sortKey = event.body.group.id;
    group.partitionKey = PARTITION_KEY;
    // TODO: Delete only if there are no active dependent entities
    let result = await Repository.deleteMaster(group);
    if (!result || (result && result.length < 0)) {
      log.debug("service :: deleteGroup :: Error", 'Group not found');
      throw (['SIPM_GRP_INF_001']);
    }
    result = event.body;
    return result;
  }

  /**
   * To fetch a record from the db
   * @param event 
   */
  public static async getPhaseList() {
    log.debug("service :: getPhaseList :: Begins");
    const keyCondition = { partitionKey: PARTITION_KEY, sortKey: beginsWith(PHASE_ID_PREFIX) };
    const queryOptions = {};
    let result = await Repository.getMasterRecords(Master, keyCondition, queryOptions);
    result = transformer.transform(result, masterTransformData);
    result.sort((a, b) => a.name.localeCompare(b.name));
    return { phases: result };
  }

  /**
   * To create a record in the db
   * @param event 
   */
  public static async createPhase(event: any) {
    const phase = new Master();
    log.debug("service :: createPhase :: Begins");
    // trims the white spaces at the ends and removes all multiple white spaces in between
    const phaseName = event.body.phase.name.replace(/\s+/g, ' ').trim();
    // to check if phase with the same name already exists
    const duplicateRecord = await this.checkForDuplicateName(phaseName, PHASE_ID_PREFIX);
    if (duplicateRecord && duplicateRecord.length > 0) {
      log.error("service :: createPhase :: Error", 'Phase Exists');
      throw (['SIPM_PHS_ERR_006']);
    }
    const maxIdValue = await this.getMaxIdOfEntity(PHASE_ENTITY);
    phase.sortKey = `${PHASE_ID_PREFIX}${maxIdValue}`;
    phase.name = phaseName;
    phase.nameInLowerCase = phaseName.toLocaleLowerCase(); // to compare the phase name case insensitively
    const conditionExpression = { condition: { ...attributeNotExists(), subject: 'sortKey' } };
    await Repository.createMaster(phase, conditionExpression);
    let result = event.body;
    return result;
  }

  /**
   * To update a record in the db
   * @param event 
   */
  public static async updatePhase(event: any) {
    log.debug("service :: updatePhase :: Begins");
    // TODO: Update only if there are no active dependent entities
    // trims the white spaces at the ends and removes all multiple white spaces in between
    const phaseName = event.body.phase.name.replace(/\s+/g, ' ').trim();
    // to check if phase with the same name already exists
    const duplicateRecord = await this.checkForDuplicateName(phaseName, PHASE_ID_PREFIX);
    if (duplicateRecord && duplicateRecord.length > 0) {
      log.error("service :: updatePhase :: Error", 'Phase Exists');
      throw (['SIPM_PHS_ERR_006']);
    }
    const params = this.createParamsForMasterUpdate(event.body.phase.id, phaseName);
    await Repository.updateMaster(params);
    log.debug("service :: updatePhase ::success");
    let result = event.body;
    return result;
  }

  /**
   * To delete a record from the db
   * @param event 
   */
  public static async deletePhase(event: any) {
    log.debug("service :: deletePhase :: Begins");
    const phase = new Master();
    phase.sortKey = event.body.phase.id;
    phase.partitionKey = PARTITION_KEY;
    // TODO: Delete only if there are no active dependent entities
    let result = await Repository.deleteMaster(phase);
    if (!result || (result && result.length < 0)) {
      log.debug("service :: deletePhase :: Error", 'Phase not found');
      throw (['SIPM_PHS_INF_001']);
    }
    result = event.body;
    return result;
  }

  /**
   * This method is used to get the max value of the id for an entity in the master
   * @param entity 
   */
  public static async getMaxIdOfEntity(entity): Promise<any> {
    log.debug("service :: getMaxIdOfEntity :: Begins");
    let maxIdValue = 0;
    const keyCondition = { partitionKey: PARTITION_KEY, entity: equals(entity) };
    const queryOptions = {};
    const maxIdValueResult = await Repository.getMaxId(MaxIdValue, keyCondition, queryOptions);
    if (maxIdValueResult && maxIdValueResult[0]) {
      maxIdValue = maxIdValueResult[0].maxIdValue;
    }
    maxIdValue++;
    await this.updateMaxIdOfEntity(maxIdValue, entity);
    return maxIdValue;
  }

  /**
   * To update the max id value(increment by1)
   * @param maxIdValue 
   * @param entity 
   */
  public static async updateMaxIdOfEntity(maxIdValue, entity) {
    const maxIdValueObject = new MaxIdValue();
    maxIdValueObject.partitionKey = PARTITION_KEY;
    maxIdValueObject.entity = entity;
    maxIdValueObject.maxIdValue = maxIdValue;
    await Repository.updateMaxId(maxIdValueObject);
  }

  /**
   * To check the uniqueness of the master's name
   * @param name 
   * @param prefix 
   */
  public static async checkForDuplicateName(name, prefix): Promise<any> {
    const keyConditionForNameCheck = { partitionKey: PARTITION_KEY, sortKey: beginsWith(prefix) };
    // to ensure the check is case insensitive
    const queryOptionForNameCheck = { filter: { ...equals(name.toLocaleLowerCase()), subject: 'nameInLowerCase' } };
    const duplicateRecord = await Repository.getMasterRecords(Master, keyConditionForNameCheck, queryOptionForNameCheck);
    return duplicateRecord;
  }

  /**
   * To create the parameter for updating the master
   * @param sortKey 
   * @param masterName 
   */
  public static createParamsForMasterUpdate(sortKey, masterName) {
    let params = {
      Key: {
        "PartitionKey": PARTITION_KEY,
        "SortKey": sortKey
      },
      UpdateExpression: "set #n=:n, #nl=:nl, #m=:m",
      ConditionExpression: 'SortKey = :s',
      ExpressionAttributeValues: {
        ":n": masterName,
        ":nl": masterName.toLocaleLowerCase(), // for case insensitive check
        ":m": new Date().toISOString(),
        ":s": sortKey
      },
      // placeholder as an alternative to actual attribute names
      ExpressionAttributeNames: {
        "#n": "Name",
        "#nl": "NameInLowerCase",
        "#m": "ModifiedDate"
      },
      ReturnValues: "UPDATED_NEW" // returns all the updated attributes
    }
    return params;
  }
  /**
   * To fetch organizationList from db
   *  
   */
  public static async getOrganizationList() {
    log.debug("service :: getOrganizationList :: Begins");
    const finalResult = await Repository.queryOrganizationList();
    //finalResult = transformer.transform(finalResult, transformData);
    return finalResult;
  }


  /**
 * To fetch organizationList from db
 * @param event 
 */
  public static async updateOrganization(event: any) {

    try {
      log.debug("service :: updateOrganization :: Begins");
      const eventBody = event.body.organization;
      let userFlag: Boolean = false;
      for (let user of eventBody.users) {
        log.debug("service :: updateOrganization ::  users", user);
        if (user?.changeCode === "A" || user?.changeCode === "U") {
          userFlag = true;
          break;
        }
      }
      if (!userFlag) {
        throw (["SIPM_ORG_ERR_014"])
      }
      const orgList: Array<Array<Organization>> = this.prepareOrgRequest(event, "update");
      await Repository.updateOrganization(orgList[0][0]);
      const userList = orgList[0].slice(1, orgList[0].length);
      log.debug("service :: updateOrganization ::userList", userList);
      const promiseCalls = [];
      if (userList.length !== 0) {
        promiseCalls.push(Repository.batchInsert(userList));
      }
      if (orgList[1].length !== 0) {
        promiseCalls.push(Repository.batchDelete(orgList[1]));
      }
      //  parllel calls for updating org , adding users and deleting users.
      const finalResult = await Promise.all([...promiseCalls]).then(() => {
        log.debug("service :: updateOrganization ::success");
        for (let i = 0; i < eventBody.users.length; i++) {
          if (eventBody.users[i]?.changeCode === "D") {
            delete eventBody.users[i];
          }
        }
        return event.body;
      });
      log.debug("service :: updateOrganization :: End1", finalResult);
      return finalResult;
    }
    catch (e) {
      log.error("service :: updateOrganization :: Error" + e);
      throw (e);
    }
  }
  /**
   * To fetch a record from the db
   * @param event 
   */
  public static async getOrganizationService(event: any) {
    try {
      const queryConditions = [{
        partitionKey: PARTITION_KEY,
        sortKey: beginsWith(ORG_DELIMITER + Util.trimOrgName(event.queryStringParameters.name))
      }
      ];
      const response = {};
      const finalResult = await Repository.queryOrganizationRecords(queryConditions);
      const userList = [];
      log.debug("service :: getOrganizationService :: result::", finalResult.length);
      if (finalResult.length !== 0) {
        for (let i = 0; i < finalResult.length; i++) {
          if (!finalResult[i]?.sortKey.includes(USER_DELIMITER)) {
            response["organization"] = transformer.transform(finalResult[i], organizationResponseData);
          }
          else {
            userList.push(transformer.transform(finalResult[i], userData))
          }
        }

        response["organization"]["users"] = userList;
        return response;
      }
      else {
        log.debug("service :: getOrganizationService :: result::", finalResult.length);
        throw (["SIPM_ORG_ERR_012"]);
      }
    }
    catch (e) {
      log.error("service :: getOrganizationService :: ERROR", e);
      throw (e);
    }
  }

  /**
   * To create a record in the db
   * @param event 
   */
  public static async createOrganizationRecord(event: any) {

    try {
      log.debug("service :: createOrganizationRecord :: Begins");
      const eventBody = event.body.organization;
      const orgObject = new Organization();
      orgObject.partitionKey = PARTITION_KEY;
      orgObject.sortKey = ORG_DELIMITER + Util.trimOrgName(eventBody.organizationName);
      const orgRecord = await Repository.getOrgRecord(orgObject);
      log.debug("service :: createOrganizationRecord :: orgRecord", orgRecord);
      if (orgRecord !== null) {
        log.debug("service :: createOrganizationRecord ::organization already present ERROR");
        throw (["SIPM_ORG_ERR_011"]);
      }
      else {
        const orgList: Array<Array<Organization>> = this.prepareOrgRequest(event, "create");
        log.debug("service :: createOrganizationRecord ::", orgList[0]);
        await Repository.batchInsert(orgList[0]);
        let finalResult = event.body;
        log.debug("service :: createOrganizationRecord :: End");
        return finalResult;
      }
    }
    catch (e) {
      log.error("service :: createOrganizationRecord :: Error::" + e);
      throw (e);
    }
  }



  /**
   * To delete a record from the db
   * @param event 
   */
  public static async deleteOrganization(event: any) {
    log.debug("service :: deleteOrganization :: Begins");
    const orgList: Array<Organization> = [];
    const orgObject = new Organization();
    orgObject.partitionKey = PARTITION_KEY;
    orgObject.sortKey = ORG_DELIMITER + Util.trimOrgName(event.body.organizationName);
    const queryConditions = [{
      partitionKey: PARTITION_KEY,
      sortKey: beginsWith(orgObject.sortKey)
    },
    {
      projection: ["emailId"]
    }]
    const OrgUsers = await Repository.queryOrganizationRecords(queryConditions);
    log.debug("service :: deleteOrganization ::OrgUsers  ", OrgUsers);
    for (let i = 0; i < OrgUsers.length; i++) {
      console.log((OrgUsers[i]?.emailId));
      if (OrgUsers[i]?.emailId) {
        const org = new Organization();
        log.debug("service :: deleteOrganization ::  orguser", OrgUsers[i]?.emailId);
        org.partitionKey = PARTITION_KEY;
        org.sortKey = orgObject.sortKey + USER_DELIMITER + OrgUsers[i]?.emailId.toLocaleLowerCase();
        orgList.push(org);
      }
    }
    orgList.push(orgObject);
    await Repository.batchDelete(orgList);
    return {};
  }

  /*
  prering organization and user object to create or update in organization table.
  */
  private static prepareOrgRequest(event: any, action: string): Array<Array<Organization>> {
    const eventBody = event.body.organization;
    const users: Array<User> = event.body.organization.users;
    const orgList: Array<Organization> = [];
    const deleteUserList: Array<Organization> = [];
    const returnList: Array<Array<Organization>> = [];
    const orgObject = new Organization();
    log.debug("service :: prepareOrgRequest :: action", action);
    orgObject.organizationName = eventBody.organizationName;
    orgObject.sortKey = ORG_DELIMITER + Util.trimOrgName(orgObject.organizationName);
    orgObject.description = eventBody.description;
    orgObject.coreFour = eventBody.coreFour;
    orgList.push(orgObject);

    for (let i = 0; i < users.length; i++) {

      if (users[i].changeCode === "D" && action === "update") {
        const deleteOrgObject = new Organization();
        deleteOrgObject.sortKey = ORG_DELIMITER + Util.trimOrgName(orgObject.organizationName) + USER_DELIMITER + users[i].emailId.toLocaleLowerCase();
        deleteUserList.push(deleteOrgObject);
      }
      else if (users[i].changeCode === "A" || action == "create") {
        const userOrgObject = new Organization();
        userOrgObject.sortKey = ORG_DELIMITER + Util.trimOrgName(orgObject.organizationName) + USER_DELIMITER + users[i].emailId.toLocaleLowerCase();
        userOrgObject.emailId = users[i].emailId;
        userOrgObject.firstName = users[i].firstName;
        userOrgObject.lastName = users[i].lastName;
        userOrgObject.phoneNo = users[i].phoneNo;
        orgList.push(userOrgObject);
      }
    }
    returnList.push(orgList);
    returnList.push(deleteUserList);

    return returnList;
  }


}

