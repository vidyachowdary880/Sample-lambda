/**
 * <<App Name>>
 * 
 * @author TOYOTA.
 * 
 */
import { Message } from "./message";

export class Status {

    /** The code. */
    private code: string;

    /** Extra attribute for details message. */
    private errorCode: string;

    /** The messages. */
    private messages: Array<Message>;

    /**
     * 
     * @param code 
     * @param errorCode 
     * @param messages 
     */
    constructor() {
    }

    /**
     * Getter code
     * @return {string}
     */
    public getCode(): string {
        return this.code;
    }

    /**
     * Getter errorCode
     * @return {string}
     */
    public getErrorCode(): string {
        return this.errorCode;
    }

    /**
     * Getter messages
     * @return {Array<Message> }
     */
    public getMessages(): Array<Message> {
        return this.messages;
    }

    /**
     * Setter code
     * @param {string} value
     */
    public setCode(value: string) {
        this.code = value;
    }

    /**
     * Setter errorCode
     * @param {string} value
     */
    public setErrorCode(value: string) {
        this.errorCode = value;
    }

    /**
     * Setter messages
     * @param {Array<Message> } value
     */
    public setMessages(value: Array<Message>) {
        this.messages = value;
    }
}