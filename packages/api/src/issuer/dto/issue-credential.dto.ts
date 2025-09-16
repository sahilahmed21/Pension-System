import { IsNotEmpty, IsObject, IsString } from 'class-validator';

/**
 * Defines the shape and validation rules for the request body
 * when an issuer requests to create a new credential.
 */
export class IssueCredentialDto {
    @IsString()
    @IsNotEmpty()
    userId: string; // The ID of the user for whom the credential is being issued

    @IsObject()
    @IsNotEmpty()
    credentialData: Record<string, any>; // The actual JSON data of the credential
}