import { DynamoDBClient, GetItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

async function getSpaces(event: APIGatewayProxyEvent, dDBClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    

    if (event.queryStringParameters) {
        if ('id' in event.queryStringParameters) {
            const spaceID = event.queryStringParameters['id'];
            const getItemResponse = await dDBClient.send(new GetItemCommand({
                TableName: process.env.TABLE_NAME,
                Key: {
                    'id': {
                        S: spaceID
                    }
                }
            }));

            if (getItemResponse && getItemResponse.Item) {
                const unMarshalledItem = unmarshall(getItemResponse.Item)
                return {
                    statusCode: 200,
                    body: JSON.stringify(unMarshalledItem)
                }
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify(`Space with ID ${spaceID} not found.`)
                }
            }

        } else {
            return {
                statusCode: 400,
                body: JSON.stringify('ID is required.')
            }
        }
    }

    const result = await dDBClient.send(new ScanCommand({
        TableName: process.env.TABLE_NAME,
    }));

    console.log('Result :', result.Items);
    const unMarshalledItems = result.Items.map(item => unmarshall(item));

    return {
        statusCode: 201,
        body: JSON.stringify(unMarshalledItems)
    };
}

export { getSpaces };
