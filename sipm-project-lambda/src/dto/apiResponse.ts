/**
 * 
 * @author TOYOTA.
 * 
 */
export class ApiResponse {
    private headers: Object;
    private statusCode: number;
    private body: Object;

    /**
     * Getter $statusCode
     * @return {number}
     */
    public getStatusCode(): number {
        return this.statusCode;
    }

    /**
     * Getter $body
     * @return {Object}
     */
    public getBody(): Object {
        return this.body;
    }

    /**
     * Getter $header
     * @return {Object}
     */
    public getHeaders(): Object {
        return this.headers;
    }

    /**
     * Setter $statusCode
     * @param {number} value
     */
    public setStatusCode(value: number) {
        this.statusCode = value;
    }

    /**
     * Setter $body
     * @param {ResponseBody} value
     */
    public setBody(value: Object) {
        this.body = JSON.stringify(value);
    }

    /**
 * Setter $header
 * @param {Object} value
 */
    public setHeaders(value: Object) {
        this.headers = value;
    }


}