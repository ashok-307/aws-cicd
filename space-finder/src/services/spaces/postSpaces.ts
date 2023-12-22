import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from 'uuid';
import { ValidateAsSpaceEntry } from '../shared/Validator';
import { createRandomID } from '../shared/Utils';


async function postSpaces(event: APIGatewayProxyEvent, dDBClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    
    const randomID = createRandomID();
    const item = JSON.parse(event.body);
    item.id = randomID;

    ValidateAsSpaceEntry(item);

    const result = await dDBClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item)
    }));

    console.log('Result :', result);
    return {
        statusCode: 201,
        body: JSON.stringify({ id: randomID })
    };
}

export { postSpaces };
