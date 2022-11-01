/**
 * <<DCS Autoreg OF>>
 * 
 * @author TOYOTA.
 * 
 */
import { Status } from "./status";


export class ResponseBody {

    /** Status Object */
    private status: Status;

    /** Request Id. */
    private requestId: string;

    /** Response Time. */
    private responseTime: string;

    /** Timestamp. */
    private timestamp: string;


    private data: Object;

    /**
     * Getter $status
     * @return {Status}
     */
    public getData(): Object {
        return this.data;
    }

    /**
     * Setter $status
     * @param {Status} value
     */
    public setData(v: Object) {
        this.data = v;
    }


    /**
     * Getter $status
     * @return {Status}
     */
    public getStatus(): Status {
        return this.status;
    }

    /**
     * Getter $requestId
     * @return {string}
     */
    public getRequestId(): string {
        return this.requestId;
    }

    /**
     * Getter $responseTime
     * @return {number}
     */
    public getResponseTime(): string {
        return this.responseTime;
    }

    /**
     * Getter $timestamp
     * @return {string}
     */
    public getTimestamp(): string {
        return this.timestamp;
    }

    /**
     * Setter $status
     * @param {Status} value
     */
    public setStatus(value: Status) {
        this.status = value;
    }

    /**
     * Setter $requestId
     * @param {string} value
     */
    public setRequestId(value: string) {
        this.requestId = value;
    }

    /**
     * Setter $responseTime
     * @param {number} value
     */
    public setResponseTime(value: string) {
        this.responseTime = value.concat("ms");
    }

    /**
     * Setter $timestamp
     * @param {string} value
     */
    public setTimestamp(value: string) {
        this.timestamp = value;
    }

}