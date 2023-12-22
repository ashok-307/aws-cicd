import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createRandomID, parseJSON } from '../shared/Utils';


async function postSpacesWithDoc(event: APIGatewayProxyEvent, dDBClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    const dDBDocClient = DynamoDBDocumentClient.from(dDBClient);
    
    const randomID = createRandomID();
    const item = parseJSON(event.body);
    item.id = randomID;

    const result = await dDBDocClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item)
    }));

    console.log('Result :', result);
    return {
        statusCode: 201,
        body: JSON.stringify({ id: randomID })
    };
}

export { postSpacesWithDoc };
