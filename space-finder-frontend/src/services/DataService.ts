import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";
import { DataStack, ApiStack } from '../../../space-finder/outputs.json';
import { SpaceEntry } from "../components/model/model";

const spaceUrl = ApiStack.SpacesApiEndpoint36C4F3B6 + 'spaces';

export class DataService {

    private authService: AuthService;
    private s3Client: S3Client | undefined;
    private region: string = 'ap-south-1';

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public reserveSpace(spaceId: string) {
        return '123';
    }

    public async getSpaces():Promise<SpaceEntry[]>{
        const getSpacesResult = await fetch(spaceUrl, {
            method: 'GET',
            headers: {
                'Authorization': this.authService.jwtToken!
            }
        });
        const getSpacesResultJson = await getSpacesResult.json();
        return getSpacesResultJson;
    }


    public async createSpace(name: string, location:string, photo?: File){
        const space: any = {};
        space.name = name;
        space.location = location;

        if (photo) {
            const uploadUrl = await this.uploadPublicFile(photo);
            space.photoUrl = uploadUrl;
            console.log(uploadUrl);
        }

        const postResult = await fetch(space.photoUrl, {
            method: 'POST',
            body: JSON.stringify(space),
            headers:{
                'Authorization': this.authService.jwtToken!
            }
        });

        const postResultJson = await postResult.json();

        return postResultJson.id;
    }

    private async uploadPublicFile(file: File) {
        const credentials: any = await this.authService.getTemporaryCredentials();
        if (!this.s3Client) {
            this.s3Client = new S3Client({
                credentials: credentials,
                region: this.region
            });
        }

        const command = new PutObjectCommand({
            Bucket: DataStack.ExportsOutputFnGetAttSpacesTable8A997355Arn242927FE,
            Key: file.name,
            ACL: 'public-read',
            Body: file
        });

        await this.s3Client.send(command);
        return `https://${command.input.Bucket}.s3.${this.region}.amazonaws.com/${command.input.Key}`
    }

    public isAuthorized(){
        return this.authService.isAuthorized();
    }
}
