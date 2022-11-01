/**
 * SIPM
 * 
 * @author TOYOTA.
 * 
 */
export class Message {

    /** The code. */
    private code: string;

    /** The description. */
    private description: string;




    /**
     * Getter $code
     * @return {string}
     */
    public getCode(): string {
        return this.code;
    }

    /**
     * Getter $description
     * @return {string}
     */
    public getDescription(): string {
        return this.description;
    }


    /**
     * Setter $code
     * @param {string} value
     */
    public setCode(value: string) {
        this.code = value;
    }

    /**
     * Setter $description
     * @param {string} value
     */
    public setDescription(value: string) {
        this.description = value;
    }


}