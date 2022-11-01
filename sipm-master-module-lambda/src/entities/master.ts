import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { PARTITION_KEY } from '../constants';
/**
 * This is for entity mapping (ORM)
 */
// table name to be mapped
@table('Master')
export class Master {
    // column name mappings
    @hashKey({
        defaultProvider: () => PARTITION_KEY,
        attributeName: "PartitionKey"
    })
    partitionKey: string;

    @rangeKey({
        type: "String",
        attributeName: "SortKey"
    })
    sortKey: string;

    @attribute({
        attributeName: "Name"
    })
    name?: string;

    @attribute({
        attributeName: "NameInLowerCase"
    })
    nameInLowerCase?: string;

    @attribute({
        attributeName: "CreatedBy"
    })
    createdBy?: string;

    @attribute({
        defaultProvider: () => new Date().toISOString(),
        attributeName: "CreatedDate"
    })
    createdDate?: string;

    @attribute({
        attributeName: "ModifiedBy"
    })
    modifiedBy?: string;

    @attribute({
        defaultProvider: () => new Date().toISOString(),
        attributeName: "ModifiedDate"
    })
    modifiedDate?: string;
}