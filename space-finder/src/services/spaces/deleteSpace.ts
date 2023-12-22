import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hasAdminGroup } from '../shared/Utils';

async function deleteSpace(event: APIGatewayProxyEvent, dDBClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if (!hasAdminGroup(event)) {
        return {
            statusCode: 401,
            body: JSON.stringify('Not Authorized')
        }
    }
    
    if (event.queryStringParameters && 'id' in event.queryStringParameters) {
        const spaceID = event.queryStringParameters['id'];

        await dDBClient.send(new DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                'id': {
                    S: spaceID
                }
            },
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(`Deleted space with ID ${spaceID}`)
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify('Please provide valid details!')
    }
  
}

export { deleteSpace };
