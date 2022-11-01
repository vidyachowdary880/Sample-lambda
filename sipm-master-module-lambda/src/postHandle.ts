
import { Util } from "./util"
import { ApiResponse } from './dto/apiResponse';
import * as msg from './resources/messages.json';
import { ResponseBody } from "./dto/responseBody";
import { Status } from "./dto/status";
import { Message } from "./dto/message";
import { log } from "./handler";
export class PostHandle {
    public execContext: any = {
        startTime: null,
        endTime: null,
        bodId: null,
        code: "400",
        errorCode: null
    };


    /**
 * This method will prepare the response for the API.
 * @param lambdaResponse 
 * @param gatewayEvent
 */
    public apiResponseHandler(lambdaResponse, gatewayEvent) {
        log.debug("PostHandle :: apiResponseHandler ::  Begins");
        const apiResponse = new ApiResponse();
        if (lambdaResponse) {
            apiResponse.setStatusCode(200);
            apiResponse.setBody(this.createFinalResponse(['SIPM_GEN_INF_000'], lambdaResponse));
            apiResponse.setHeaders(Util.addHeadersToResponse(gatewayEvent));

            return apiResponse;
        } else {
            throw ["SIPM_GEN_ERR_001"];
        }
    }
    /**
 * This method will prepare the error response in case of failure.
 * @param messageCodes 
 */
    public apiErrorHandler(messageCodes, event) {
        log.debug("PostHandle :: apiErrorHandler ::  Begins");
        const apiResponse = new ApiResponse();
        log.debug("PostHandle :: apiErrorHandler ::  messageCodes", messageCodes);
        const responseBody = this.createFinalResponse(messageCodes, null);
        apiResponse.setStatusCode(200);
        apiResponse.setBody(responseBody);
        apiResponse.setHeaders(Util.addHeadersToResponse(event));
        return apiResponse;
    }

    /**
     * This method create the final lambda response.
     * @param isSuccess 
     * @param messageCodes
     * @param lambdaResponse
     */
    private createFinalResponse(messageCodes, lambdaResponse) {

        const responseBody = new ResponseBody();
        const status = new Status();

        const messageArray = []
        if (!messageCodes.length) {
            messageCodes = ["SIPM_GEN_ERR_002"];
        }
        for (let i = 0; i < messageCodes.length; i++) {
            const messages = new Message();
            const messageCode = messageCodes[i];
            messages.setCode(messageCodes[i]);
            messages.setDescription(msg[messageCode]["description"]);
            status.setCode(msg[messageCodes[i]].httpCode);
            messageArray.push(messages);
        }
        status.setMessages(messageArray);
        responseBody.setStatus(status);
        this.execContext.endTime = new Date().getTime();
        responseBody.setResponseTime((this.execContext.endTime - this.execContext.startTime).toString());
        responseBody.setTimestamp(new Date().toISOString());
        responseBody.setRequestId(this.execContext.bodId);
        responseBody.setData(lambdaResponse);
        return responseBody;
    }

}