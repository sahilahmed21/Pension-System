import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { IssuerService } from './issuer.service';
import { IssueCredentialDto } from './dto/issue-credential.dto';

@Controller('issuer')
export class IssuerController {
    constructor(private readonly issuerService: IssuerService) { }

    /**
     * The API endpoint for an admin/issuer to issue a new credential.
     * URL: POST /issuer/issue
     */
    @Post('issue')
    issueCredential(
        @Body(new ValidationPipe()) issueCredentialDto: IssueCredentialDto,
    ) {
        return this.issuerService.issueCredential(issueCredentialDto);
    }
}