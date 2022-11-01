
import { ResponseBody } from '../../src/dto/responseBody';
import { Status } from "../../src/dto/status";

describe('responseBody Test ', () => {
    test(' Setters and getters ', () => {
        var responseBody: ResponseBody = new ResponseBody();
        responseBody.setData("");
        responseBody.setRequestId("");
        responseBody.setResponseTime("");
        responseBody.setStatus(new Status);
        responseBody.setTimestamp("");
        responseBody.getData();
        responseBody.getRequestId();
        responseBody.getResponseTime();
        responseBody.getStatus();
        responseBody.getTimestamp();
    })
})