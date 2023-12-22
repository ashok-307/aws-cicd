import { SNSEvent } from "aws-lambda";

// Fake One...
const webHookUrl = "https://hooks.slack.com/services./TJHGASajhbas786ashgasdu/qujashJHgJHgJhggabsjha987ahbsx";

async function handler(event: SNSEvent, context) {
    let record;
    for(let index = 0; index < event.Records.length; index++) {
        record = event.Records[index];
        await fetch(webHookUrl, {
            method: 'POST',
            body: JSON.stringify({
                'text': `Pal, we have a problem ${record.Sns.Message}`
            })
        })
    }
}

export { handler };
