import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PinataClient from '@pinata/sdk';
import { Readable } from 'stream';

@Injectable()
export class IpfsService implements OnModuleInit {
    private readonly logger = new Logger(IpfsService.name);
    private pinata: PinataClient;

    constructor(private readonly configService: ConfigService) { }

    onModuleInit() {
        const pinataJwt = this.configService.get<string>('PINATA_JWT');
        if (!pinataJwt) {
            throw new Error('PINATA_JWT not configured in .env');
        }
        this.pinata = new PinataClient({ pinataJWTKey: pinataJwt });
        this.logger.log('Pinata client initialized.');
    }

    /**
     * Uploads a JSON object to IPFS and pins it.
     * @param jsonContent The JSON object to upload.
     * @param fileName The name for the file on IPFS.
     * @returns The IPFS Content Identifier (CID).
     */
    async uploadJson(
        jsonContent: Record<string, any>,
        fileName: string,
    ): Promise<string> {
        this.logger.log(`Uploading ${fileName} to IPFS...`);
        try {
            const result = await this.pinata.pinJSONToIPFS(jsonContent, {
                pinataMetadata: {
                    name: fileName,
                },
            });
            this.logger.log(`Successfully pinned JSON. CID: ${result.IpfsHash}`);
            return result.IpfsHash;
        } catch (error) {
            this.logger.error('Failed to upload JSON to IPFS', error);
            throw new Error('IPFS upload failed.');
        }
    }
}