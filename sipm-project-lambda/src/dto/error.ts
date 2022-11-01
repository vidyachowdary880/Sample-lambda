/**
 * SIPM-Web-Services
 *
 * @author TOYOTA.
 *
 */
export class Error {
    private code: string;
    private desc: string;

    constructor(errorCode: string, desc: string) {
        this.code = errorCode;
        this.desc = desc;
    }
    /**
     * Error code getter.
     */
    public getErrorCode() {
        return this.code;
    }
    /**
     * ErorCode setter.
     * @param code 
     */
    public setErrorCode(code: string) {
        this.code = code;
    }
    /**
     * Error desc getter.
     */
    public getErrorDesc() {
        return this.desc;
    }
    /**
     * Error desc setter.
     * @param desc.
     */
    public setErrorDesc(desc: string) {
        this.desc = desc;
    }
}