var bunyan = require('bunyan');
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import { SSM } from 'aws-sdk';
const ssm = new SSM();
/**
 * Logger Util Class : contains methods to create logger objects.
 */
export class Util {

	/**
	 * Method to get the logger object across the service.
	 * @param serviceName 
	 */
	public static getLogger(serviceName, logLevel) {
		const log = Util.getLoggerObject(serviceName, logLevel);
		//Removing the default unwanted details added by bunyan create logger utility method.
		delete log.fields.hostname;
		delete log.fields.level;
		delete log.fields.v;

		return log
	}

	/**
	 * Method provides logger object based on service name and log level.
	 * @param serviceName 
	 * @param logLevel 
	 */
	private static getLoggerObject(serviceName, logLevel) {
		return bunyan.createLogger({
			name: serviceName,
			bodid: "",
			logLevel: logLevel,
			streams: [
				{
					level: logLevel,
					stream: process.stdout
				}
			]
		});
	}

	/**
	 * Util for getCurrentTime
	 */
	public static getTime() {
		return new Date().getTime();
	}

	/**
 * This method will add the security headers and the header for CORS support to the response.
 */
	public static addHeadersToResponse(event) {
		const headers = {};
		headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubdomains;';
		headers['Content-Security-Policy'] = "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'";
		headers['X-Content-Type-Options'] = 'nosniff';
		headers['X-Frame-Options'] = 'same-origin';
		headers['X-XSS-Protection'] = '1; mode=block';
		headers['Referrer-Policy'] = 'same-origin';
		headers['Pragma'] = 'no-cache';
		headers['Access-Control-Allow-Origin'] = '*';
		headers['Access-Control-Allow-Methods'] = event.headers['Access-Control-Allow-Methods'];
		headers['Access-Control-Allow-Headers'] = event.headers['Access-Control-Allow-Headers'];
		headers['Content-Type'] = event.headers['Content-Type'];
		headers['BODID'] = event.headers['bodId'];
		return headers;
	}



	public static handlerPath = (context: string) => {
		return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`
	};



	/**
	 * method to parse the json body
	 * @param handler 
	 */
	public static middyfy = (handler) => {
		return middy(handler).use(middyJsonBodyParser())
	}

	/**
	 * method to decrypt the kms (secret) keys from the param store
	 * @param ciphertext 
	 */
	public static async decrypt(ciphertext: string[]): Promise<any> {
		const result = await ssm
			.getParameters({
				Names: ciphertext,
				WithDecryption: true
			})
			.promise();
		return result;
	}

	/**
 * method to decrypt the kms (secret) keys from the param store
 * @param ciphertext 
 */
	public static async getips(ipKey: string): Promise<any> {
		const result = await ssm
			.getParameter({
				Name: ipKey
			})
			.promise();
		return result;
	}


	public static trimOrgName(name): string {
		return name.replace(/\s+/g, " ").trim().replace(/ /g, "_").toUpperCase();
	}
}

