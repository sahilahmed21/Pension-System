import { Injectable } from '@nestjs/common';
import { BlockchainService } from './blockchain/blockchain.service';

@Injectable()
export class AppService {
  // Inject our new service
  constructor(private readonly blockchainService: BlockchainService) { }

  async getHello(): Promise<string> {
    // Call the test function
    const chainId = await this.blockchainService.getChainId();
    return `Hello from the Backend! Connected to Chain ID: ${chainId}`;
  }
}