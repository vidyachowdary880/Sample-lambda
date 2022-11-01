import Ajv from 'ajv';
import * as schemaConfig from "./resources/schema";
import { log } from './handler';

export class Validator {

    private ajv: Ajv;


    constructor() {

        this.ajv = new Ajv({ allErrors: true });
        require("ajv-errors")(this.ajv);
        Object.keys(schemaConfig).forEach(domain => {
            this.ajv.addSchema(schemaConfig[domain], domain);
        });

    }
    /**
     * This function is to validate the request data using ajv schema.
     * @param schema 
     * @param data 
     */
    public validate(schema: string, data) {
        const valid = this.ajv.validate(schema, data);
        if (!valid) {
            log.error('ajv validation error:', JSON.stringify(this.ajv.errors[0].params));
            const errorCodes = [];
            for (let i = 0; i < this.ajv.errors.length; i++) {
                errorCodes.push(this.ajv.errors[i].message);
            }
            throw errorCodes;
        }
    }


}