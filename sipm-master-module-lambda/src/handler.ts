import { Service } from './service';
import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import { Validator } from './validationUtil';
import { PostHandle } from './postHandle';
import * as operationsJson from './resources/operations.json';
import { Util } from './util';
import * as constants from './constants';
const logLevel = process.env.LOGGER_LEVEL;
export const log = Util.getLogger("master-module-lambda", logLevel);
const { v4: uuidv4 } = require('uuid');
const validator: Validator = new Validator();
const AWSXRay = require('aws-xray-sdk-core');
AWSXRay.capturePromise();
AWSXRay.setContextMissingStrategy("LOG_ERROR");
/**
 * This is a handler method to get a record from the db
 * @param event 
 */
export const init: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  log.debug("handler :: init :: Begins", event.requestContext?.identity?.sourceIp);
  log.debug("handler :: init :: context", context);
  if (process.env.APP_ENVIRONMENT === "dev") {
    const ipStrings = await Util.getips("ips");
    const ips = ipStrings.Parameter.Value.split(",");
    log.debug("handler :: init :: ips1", ips);
    let ipFlag = false;
    for (let i of ips) {
      if (i == event.requestContext.identity.sourceIp) {
        ipFlag = true;
        break;
      }

    }
    if (!ipFlag) {
      cb(null, "unauthorized");
      return null;
    }
  }
  const entity = event.pathParameters.entity.toLocaleLowerCase();
  const httpMethod = event.httpMethod.toLocaleLowerCase();
  const entityMethod = `${entity}_${httpMethod}`;
  let apiResponse;
  const postHandle: PostHandle = new PostHandle();
  const lambdaStartTime = new Date().getTime();
  const action = (event.queryStringParameters && event.queryStringParameters.action) ? event.queryStringParameters.action : null;

  //Generating and adding Bodid if not avialble.
  if (!event.headers.bodId) {
    event.headers.bodId = uuidv4();
  }
  postHandle.execContext.bodId = event.headers.bodId;
  postHandle.execContext.startTime = lambdaStartTime;
  try {
    let opCode = '';
    // set the opCode based on the entity and http method
    opCode = getOpCode(entityMethod, entity, event, action);
    // for an invalid opCode
    if (!operationsJson[opCode]) {
      throw ['SIPM_GEN_ERR_003'];
    }
    // validate the request body for all non-get methods
    // get the validation schema based on the opCode
    if (httpMethod !== 'get') {
      validator.validate(operationsJson[opCode].schema, event.body);
    } else if (event.queryStringParameters) {
      validator.validate(operationsJson[opCode].schema, event);
    }
    log.info("handler :: init :: validationSuccess entityMethod", opCode + "-" + entityMethod);
    AWSXRay.captureFunc("access DynamoDB : " + context.functionName + " : " + opCode, function (subsegment) {
      if (subsegment) {
        subsegment.addAnnotation("BODID", postHandle.execContext.bodId);
      }
    })
    // call the service based on the opCode
    const finalResult = await Service[operationsJson[opCode].service](event);
    log.debug("handler :: init ::  final response", finalResult);
    apiResponse = postHandle.apiResponseHandler(finalResult, event);
    cb(null, apiResponse);
  }
  catch (e) {
    log.error('Error', e);
    apiResponse = postHandle.apiErrorHandler(e, event);
    log.debug("handler :: init :: Error", apiResponse);
    cb(null, apiResponse);
  }
}

export const main = Util.middyfy(init);


/**
 * To set the opcode based on the entity and http method for different masters
 * @param entityMethod 
 * @param entity 
 * @param event 
 * @param action 
 */
function getOpCode(entityMethod: string, entity: string, event, action: string) {
  log.debug("handler :: getOpCode :: entityMethod action", entityMethod, action);
  let opCode = "";
  if (entity === "group") {
    if (entityMethod == "group_get") {
      opCode = constants.GROUP_LIST;
    } else if (entityMethod == "group_post") {
      opCode = constants.GROUP_CREATE;
    } else if (entityMethod == "group_put") {
      if (action === 'delete') {
        opCode = constants.GROUP_DELETE;
      } else if (action === 'update') {
        opCode = constants.GROUP_UPDATE;
      }
    }
  } else if (entity === "phase") {
    if (entityMethod == "phase_get") {
      opCode = constants.PHASE_LIST;
    } else if (entityMethod == "phase_post") {
      opCode = constants.PHASE_CREATE;
    } else if (entityMethod == "phase_put") {
      if (action === 'delete') {
        opCode = constants.PHASE_DELETE;
      } else if (action === 'update') {
        opCode = constants.PHASE_UPDATE;
      }
    }
  }
  if (entity === "organization") {
    if (entityMethod === "organization_get" && event.queryStringParameters && event.queryStringParameters["name"]) {
      opCode = constants.ORGANIZATION_GET_BY_ID;
    } else if (entityMethod == "organization_get" && event.queryStringParameters == null) {
      opCode = constants.ORGANIZATION_LIST;
    } else if (entityMethod == "organization_post") {
      opCode = constants.ORGANIZATION_CREATE;
    } else if (entityMethod == "organization_put") {
      if (action === 'delete') {
        opCode = constants.ORGANIZATION_DELETE;
      } else if (action === 'update') {
        opCode = constants.ORGANIZATION_UPDATE;
      }
    }
  }
  return opCode;
}

