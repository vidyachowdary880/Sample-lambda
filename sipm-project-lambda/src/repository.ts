import { DataMapper } from '@aws/dynamodb-data-mapper';
var AWSXRay = require('aws-xray-sdk-core');
import { log } from './handler';
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
import { beginsWith, attributeExists } from '@aws/dynamodb-expressions';
import { Organization } from "./entities/organization";
import { MASTER } from './constants';


AWS.config.update({
    region: process.env.REGION,
});
const client = new AWS.DynamoDB.DocumentClient();
const tablePrefix = "sipm-" + process.env.APP_ENVIRONMENT + "-" + process.env.SHORT_REGION + "-db-";
const dataMapper = new DataMapper({
    client: new AWS.DynamoDB(), // the SDK client used to execute operations
    tableNamePrefix: tablePrefix// optionally, you can provide a table prefix to keep your dev and prod tables separate
});

AWSXRay.capturePromise();
AWSXRay.setContextMissingStrategy("LOG_ERROR");
// The parent repository class with all the generic db calls
export class Repository {

    /**
     * To query the table and fetch the record based on the partition key
     */
     public static async getMaxId(dataObject, keyCondition, queryOptions) {
        log.debug("repository :: getMaxId :: Begins");
        try {
            const result = [];
            const iterator = dataMapper.query(dataObject, keyCondition, queryOptions);
            for await (const item of iterator) {
                result.push(item);
            }
            log.debug("repository :: getMaxId :: successful");
            return result;
        } catch (error) {
            log.error("repository :: getMaxId :: Error", error);
            throw (['SIPME001']);
        }
    }

    /**
     * To query the table and fetch the record based on the partition key
     */
    public static async getMasterRecords(dataObject, keyCondition, queryOptions) {
        log.debug("repository :: getMasterRecords :: Begins");
        try {
            const result = [];
            const iterator = dataMapper.query(dataObject, keyCondition, queryOptions);
            for await (const item of iterator) {
                result.push(item);
            }
            log.debug("repository :: getMasterRecords :: successfull");
            return result;
        } catch (error) {
            log.error("repository :: getMasterRecords :: Error", error);
            throw (['SIPME001']);
        }
    }

    /**
     *  Function to put data in dynamodb
     * @dataToSave
     */
    public static createMaster(dataToSave: Object, conditionExpression): Promise<any> {
        return new Promise((resolve, reject) => {
            log.debug("repository :: putData :: Begins");
            // Creates (or overwrites) an item in the table
            dataMapper.put(dataToSave, conditionExpression).then(objectSaved => {
                // the record has been saved
                log.debug("repository :: putData :: successful");
                resolve(objectSaved);
            }).catch((error) => {
                log.error("repository :: putData :: Error", error);
                reject(error);
            });
        });
    }

    /**
     * Method to update master record
     * @param params 
     */
    public static async updateMaster(params: Object): Promise<any> {
        log.debug("repository :: updateMaster :: Begins");
        params['TableName'] = tablePrefix + MASTER;
        try {
            const result = await client.update(params).promise();
            log.debug("repository :: updateMaster success :: end");
            return result;
        } catch (e) {
            if (e.code === "ConditionalCheckFailedException") {
                log.info("records not found");
                throw (["SIPME008"]);
            }
            log.error("repository :: updateMaster Error :: end", e);
            throw (e);
        }
    }

    /**
     * Function to update an item in dynamodb
     * @param dataToBeUpdated 
     */
     public static updateMaxId(dataToBeUpdated: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            // Updates an item in the table
            log.debug("repository :: updateData :: Begins");
            dataMapper.update(dataToBeUpdated).then(dbResponse => {
                log.debug("repository :: updateData :: Success", dbResponse);
                resolve(dbResponse);
            })
                .catch(error => {
                    log.error('Error while updating', error);
                    reject(error);
                })
        });
    }

    /**
     * Function to delete data from dynamodb
     * @param dataToDelete
     */
    public static deleteMaster(dataToDelete: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            // Removes an item from the table
            log.debug("repository :: deleteMaster :: Begins");
            dataMapper.delete(dataToDelete).then(dbResponse => {
                log.debug("repository :: deleteMaster :: SUCCESS");
                resolve(dbResponse);
            })
                .catch(error => {
                    log.debug("repository :: deleteMaster :: ERROR", error);
                    reject(error);
                })
        });
    }

    /**
         * Function to get organization record data from dynamodb
         * @param dataToFetch 
         */
    public static getOrgRecord(dataToFetch: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            // Retrieves an item from DynamoDB
            log.debug("repository :: getOrgRecord :: Begins");
            dataMapper.get(dataToFetch).then(dbReponse => {
                // the item was found
                log.debug("repository :: getOrgRecord ::  response", dbReponse);
                resolve(dbReponse);
            })
                .catch(error => {
                    if (error.name === "ItemNotFoundException") {
                        log.debug("repository :: getOrgRecord ::  error", error);
                        resolve(null)
                    }
                    else {
                        log.error("repository :: getOrgRecord ::  ERROR", error);
                        reject(error);
                    }
                })
        });
    }
    /**
  *  Function to batchput data in dynamodb
  * @dataToSave
  */
    public static async batchInsert(dataToSave: Array<Object>) {
        try {
            log.debug("repository :: batchInsert :: Begins");
            // Creates (or overwrites) an item in the table
            for await (const result of dataMapper.batchPut(dataToSave)) {
                log.debug("repository :: batchInsert", result);
            }
            log.debug("repository :: batchInsert :: end");
            return null;
        }
        catch (e) {
            log.error("repository :: batchInsert :: ERROR", e);
            throw (e);
        }
    }




    /**
   * To query the Org table and fetch the record based on the partition key and sortKey
   */
    public static async queryOrganizationRecords(queryConditions) {
        log.debug("repository :: queryOrganizationRecords :: Begins",);
        let result = [];

        try {
            const iterator = dataMapper.query(Organization, queryConditions[0], queryConditions[1]);
            for await (const item of iterator) {
                result.push(item);
                log.debug("repository :: queryOrganizationRecords :: data", item);
            }
            log.debug("repository :: queryOrganizationRecords  success:: END");
            return result;
        } catch (error) {
            log.error("repository :: queryOrganizationRecords :: ERROR", error);
            throw (error);
        }

    }

    /**
* To query the Org table and fetch the record based on the partition key and sortKey
*/
    public static async queryOrganizationList() {
        log.debug("repository :: queryOrganizationList :: Begins");
        let result = [];
        const keyCondition = {
            partitionKey: "SIPM",
            sortKey: beginsWith("ORG#")
        }

        let predicate = attributeExists();
        const filterCondition = {
            ...predicate,
            subject: 'organizationName'
        }

        const queryOptions = {
            filter: filterCondition,
            projection: ["organizationName", "description", "coreFour"]
        }
        try {
            const iterator = dataMapper.query(Organization, keyCondition, queryOptions);
            for await (const item of iterator) {
                result.push(item);
                log.debug("repository :: queryOrganizationList :: data", item);
            }
            log.debug("repository :: queryOrganizationList  success:: END");
            return result;
        } catch (error) {
            log.error("repository :: queryOrganizationList :: ERROR", error);
            throw (error);
        }

    }



    /**
     * Function to delete data from dynamodb
     * @param dataToDelete
     */
    public static async batchDelete(dataToDelete: Array<Object>): Promise<any> {
        try {
            log.debug("repository :: batchDelete :: Begins");
            // Creates (or overwrites) an item in the table
            for await (const result of dataMapper.batchDelete(dataToDelete)) {
                log.debug("repository :: batchDelete", result);
            }
            log.debug("repository :: batchDelete success :: end");
            return null;
        }
        catch (e) {
            if (e)
                log.error("repository :: batchDelete :: ERROR", e);
            throw (e);
        }

    }


    /**
  * Function to update organization data to dynamodb
  * @param updateObject
  */
    public static async updateOrganization(updateObject: Organization): Promise<any> {
        try {
            log.debug("repository :: updateOrganization :: Begins");
            var params = {
                TableName: tablePrefix + "Organization",
                Key: {
                    "PartitionKey": "SIPM",
                    "SortKey": updateObject.sortKey
                },
                UpdateExpression: "set Description=:d, CoreFour=:c,ModifiedDate=:m",
                ConditionExpression: 'SortKey = :s',
                ExpressionAttributeValues: {
                    ":d": updateObject.description,
                    ":c": updateObject.coreFour,
                    ":m": new Date().toISOString(),
                    ":s": updateObject.sortKey
                },
                ReturnValues: "UPDATED_NEW"
            };

            const result = await client.update(params).promise();
            log.debug("repository :: updateOrganization success :: end");
            return result;
        }
        catch (e) {
            if (e.code === "ConditionalCheckFailedException") {
                log.info("records not found with ", updateObject.sortKey);
                throw (["SIPME413"]);
            }
            log.error("repository :: updateOrganization :: ERROR", e);
            throw (e);
        }

    }
}
