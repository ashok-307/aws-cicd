import { SpaceEntry } from "../model/Model";


export class MissingFieldError extends Error {
    constructor(missingFIeld: string) {
        super(missingFIeld);
    }
}

export class JSONError extends Error {}

export function ValidateAsSpaceEntry(arg: any) {
    if ((arg as SpaceEntry).location === undefined) {
        throw new MissingFieldError('location');
    }
    if ((arg as SpaceEntry).name === undefined) {
        throw new MissingFieldError('name');
    }
    if ((arg as SpaceEntry).id === undefined) {
        throw new MissingFieldError('id');
    }
}
