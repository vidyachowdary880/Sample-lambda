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

    /** The detailed description. */
    private detailedDescription: string;


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
     * Getter $detailedDescription
     * @return {string }
     */
    public getDetailedDescription(): string {
        return this.detailedDescription;
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

    /**
     * Setter $detailedDescription
     * @param {string } value
     */
    public setDetailedDescription(value: string) {
        this.detailedDescription = value;
    }
}