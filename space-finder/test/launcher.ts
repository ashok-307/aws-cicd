import { handler } from "../src/services/spaces/handler";

// TO: Debug locally using ts-node...
// -----------------------------------------------------
process.env.AWS_REGION = 'ap-south-1';
process.env.TABLE_NAME = 'SpaceStack-027d8b590114';

// handler({
//     httpMethod: 'DELETE',
//     queryStringParameters: {
//         id: '385ce841-cc27-4de6-b382-f22092f2d051'
//     },
// } as any, {} as any).then((res) => {
//     console.log('RES :', res);
// });

// handler({
//     httpMethod: 'PUT',
//     queryStringParameters: {
//         id: '34335'
//     },
//     body: JSON.stringify({
//         location: 'Paris Updated'
//     })
// } as any, {} as any);


// handler({
//     httpMethod: 'GET',
//     queryStringParameters: {
//         id: '34335'
//     }
// } as any, {} as any);

handler({
    httpMethod: 'POST',
    body: JSON.stringify({
        location: 'London',
        name: 'Location'
    })
} as any, {} as any);
