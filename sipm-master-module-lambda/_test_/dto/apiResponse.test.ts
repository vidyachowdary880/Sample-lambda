
import { ApiResponse } from '../../src/dto/apiResponse';
describe('apiResponse Test ', () => {
    test(' Setters and getters ', () => {
        var apiResponse: ApiResponse = new ApiResponse();
        expect(apiResponse.getStatusCode()).toBe(undefined);
        expect(apiResponse.getBody()).toBe(undefined);
        expect(apiResponse.getHeaders()).toBe(undefined);
        apiResponse.setStatusCode(undefined);
        apiResponse.setBody(undefined);
        apiResponse.setHeaders(undefined);


    })
})