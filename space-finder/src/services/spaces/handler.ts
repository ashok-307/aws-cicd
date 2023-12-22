import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postSpaces } from "./postSpaces";
import { getSpaces } from "./getSpaces";
import { postSpacesWithDoc } from "./postSpacesWithDoc";
import { updateSpace } from "./updateSpace";
import { deleteSpace } from "./deleteSpace";
import { JSONError, MissingFieldError } from "../shared/Validator";
import { addCorsHeaders } from "../shared/Utils";

import { captureAWSv3Client, getSegment } from 'aws-xray-sdk-core';

const dDbClient = captureAWSv3Client(new DynamoDBClient({}));

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    let response: APIGatewayProxyResult;

    const subSeg = getSegment().addNewSubsegment('MyLongCall');
    await new Promise(resolve => { setTimeout(resolve, 3000) });
    
    subSeg.close();
    const subSeg2 = getSegment().addNewSubsegment('MyLongCall');
    await new Promise(resolve => { setTimeout(resolve, 500) });
    subSeg2.close();

    try {
        switch(event.httpMethod) {
            case "GET":
                // message = "Some text from GET!";
                const getResponse = await getSpaces(event, dDbClient);
                response = getResponse;
                return getResponse;
            case "DELETE":
                // message = "Some text from GET!";
                const deleteResponse = await deleteSpace(event, dDbClient);
                response = getResponse;
                return deleteResponse;
            case "POST":
                // message = "Some text from POST!";
                // const postResponse = await postSpaces(event, dDbClient);
                const postResponse = await postSpacesWithDoc(event, dDbClient);
                response = getResponse;
                return postResponse;
            case "PUT":
                // message = "Some text from POST!";
                // const postResponse = await postSpaces(event, dDbClient);
                const putResponse = await updateSpace(event, dDbClient);
                response = getResponse;
                return putResponse;
            default:
                break;
        }
    } catch (error) {
        console.log('ERROR :', error.message);
        if (error instanceof MissingFieldError) {
            return {
                statusCode: 400,
                body: JSON.stringify(error.message)
            }
        }
        if (error instanceof JSONError) {
            return {
                statusCode: 400,
                body: JSON.stringify(error.message)
            }
        }
        return {
            statusCode: 500,
            body: JSON.stringify(error.message)
        }
    }

    addCorsHeaders(response);
    return response;
}

export { handler };
