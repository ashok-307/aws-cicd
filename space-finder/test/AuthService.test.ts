import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";


async function testAuth() {
    const authService = new AuthService();

    const res = await authService.login('kingkong', 'Kingkong@1');
    // console.log('Res :', res);
    const credentials = await authService.generateTemporaryCredentials(res);
    // console.log('Cred :', credentials);
    const buckets = listBuckets(credentials);
    console.log('buckets :', buckets);
}

async function listBuckets(credentials: any) {
    const client = new S3Client({
        credentials
    });

    const command = new ListBucketsCommand({});
    const result = await client.send(command);
    return result;
}

testAuth();
