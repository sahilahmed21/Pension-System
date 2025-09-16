import { Injectable, Logger } from '@nestjs/common';
import { IssueCredentialDto } from './dto/issue-credential.dto';
import { BlockchainService } from '../blockchain/blockchain.service';
import { IpfsService } from '../ipfs/ipfs.service';
import { UserService } from '../user/user.service';
import { keccak256, toHex, Hash } from 'viem';

@Injectable()
export class IssuerService {
    private readonly logger = new Logger(IssuerService.name);

    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly ipfsService: IpfsService,
        private readonly userService: UserService,
    ) { }

    async issueCredential(
        issueCredentialDto: IssueCredentialDto,
    ): Promise<{ message: string; transactionHash: Hash; ipfsCid: string }> {
        this.logger.log(`Issuing credential for user: ${issueCredentialDto.userId}`);

        const fullCredential = {
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://www.w3.org/2018/credentials/examples/v1',
            ],
            id: `http://example.gov/credentials/${issueCredentialDto.userId}`,
            type: ['VerifiableCredential', 'PensionerStatusCredential'],
            issuer: `did:pension:${this.blockchainService.issuerAccount.address}`,
            issuanceDate: new Date().toISOString(),
            credentialSubject: {
                id: `did:pension:user:${issueCredentialDto.userId}`,
                ...issueCredentialDto.credentialData,
            },
        };

        const ipfsCid = await this.ipfsService.uploadJson(
            fullCredential,
            `pension-credential-${issueCredentialDto.userId}.json`,
        );

        const credentialJsonString = JSON.stringify(fullCredential);
        const vcHash = keccak256(toHex(credentialJsonString));

        const transactionHash = await this.blockchainService.anchorVcOnChain(vcHash);

        await this.userService.updateSubmissionStatus(issueCredentialDto.userId, 'approved');

        return {
            message: 'Credential successfully anchored and stored.',
            transactionHash,
            ipfsCid,
        };
    }
}