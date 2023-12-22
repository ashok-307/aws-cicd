import { SNSEvent } from "aws-lambda";
import { handler } from "../src/services/monitor/handler";


const snsEvent: any = {
    Records: [
        {
            Sns: {
                Message: 'This is a test.'
            }
        }
    ]
}

handler(snsEvent, {});
