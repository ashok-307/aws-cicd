import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

async function updateSpace(event: APIGatewayProxyEvent, dDBClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    

    if (event.queryStringParameters && 'id' in event.queryStringParameters && event.body) {
        const spaceID = event.queryStringParameters['id'];
        const parsedBody = JSON.parse(event.body);
        const requestBodyKey = Object.keys(parsedBody)[0];
        const requestBodyValue = event.body[requestBodyKey];

        const updateSpaceResult = await dDBClient.send(new UpdateItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                'id': {
                    S: spaceID
                }
            },
            UpdateExpression: 'set #zzzNew = :new',
            ExpressionAttributeValues: {
                ':new': {
                    S: requestBodyValue
                }
            },
            ExpressionAttributeNames: {
                '#zzzNew': requestBodyKey
            },
            ReturnValues: 'UPDATED_NEW'
        }));

        return {
            statusCode: 204,
            body: JSON.stringify(updateSpaceResult.Attributes)
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify('Please provide valid details!')
    }
  
}

export { updateSpace };
