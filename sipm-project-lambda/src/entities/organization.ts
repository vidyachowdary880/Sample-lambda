import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { PARTITION_KEY } from '../constants';
/**
 * This is for entity mapping (ORM)
 */
// table name to be mapped
@table('Organization')
export class Organization {
    // column name mappings
    @hashKey({
        defaultProvider: () => PARTITION_KEY,
        type: "String", attributeName: "PartitionKey"
    })
    partitionKey: string;

    @rangeKey({
        type: "String",
        attributeName: "SortKey"
    })
    sortKey: string;

    @attribute({ attributeName: "OrganizationName" })
    organizationName?: string;

    @attribute({ attributeName: "Description" })
    description?: string;

    @attribute({ attributeName: "EmailId" })
    emailId?: string;

    @attribute({ attributeName: "FirstName" })
    firstName?: string;

    @attribute({ attributeName: "LastName" })
    lastName?: string;

    @attribute({ attributeName: "PhoneNo" })
    phoneNo?: string;

    @attribute({ attributeName: "CoreFour" })
    coreFour?: Object;

    @attribute({ defaultProvider: () => new Date().toISOString(), attributeName: "CreatedDate" })
    createdDate?: string;

    @attribute({ defaultProvider: () => new Date().toISOString(), attributeName: "ModifiedDate" })
    modifiedDate?: string;
}