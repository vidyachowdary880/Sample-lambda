import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { PARTITION_KEY } from '../constants';
/**
 * This is for entity mapping (ORM)
 */
// table name to be mapped
@table('MaxIdValue')
export class MaxIdValue {
    // column name mappings
    @hashKey({
        defaultProvider: () => PARTITION_KEY,
        attributeName: "PartitionKey"
    })
    partitionKey: string;

    @rangeKey({
        type: "String",
        attributeName: "Entity"
    })
    entity: string;

    @attribute({
        attributeName: "MaxIdValue"
    })
    maxIdValue: number;
}