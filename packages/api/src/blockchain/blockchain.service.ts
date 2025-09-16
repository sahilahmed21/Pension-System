import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    createPublicClient,
    createWalletClient,
    http,
    Hex,
    PublicClient,
    WalletClient,
    PrivateKeyAccount,
    Hash,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';
import { vcRegistryAbi } from '../abis/vc-registry.abi';

@Injectable()
export class BlockchainService implements OnModuleInit {
    private readonly logger = new Logger(BlockchainService.name);
    public publicClient: PublicClient;
    public walletClient: WalletClient;
    public issuerAccount: PrivateKeyAccount;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        const rpcUrl = this.configService.get<string>('RPC_URL');
        const privateKey = this.configService.get<Hex>('ISSUER_PRIVATE_KEY');

        if (!rpcUrl || !privateKey) {
            throw new Error(
                'Missing required environment variables: RPC_URL or ISSUER_PRIVATE_KEY',
            );
        }

        this.publicClient = createPublicClient({
            chain: anvil,
            transport: http(rpcUrl),
        });

        this.issuerAccount = privateKeyToAccount(privateKey);

        this.walletClient = createWalletClient({
            account: this.issuerAccount,
            chain: anvil,
            transport: http(rpcUrl),
        });

        this.logger.log('Blockchain clients initialized');
        this.logger.log(`Issuer wallet address: ${this.issuerAccount.address}`);
    }

    async getChainId(): Promise<number> {
        const chainId = await this.publicClient.getChainId();
        this.logger.log(`Successfully connected to chain ID: ${chainId}`);
        return chainId;
    }

    /**
     * Calls the `anchorVC` function on the VCRegistry smart contract.
     * @param vcHash The keccak256 hash of the credential to anchor.
     * @returns The transaction hash.
     */
    async anchorVcOnChain(vcHash: Hex): Promise<Hash> {
        const vcRegistryAddress = this.configService.get<Hex>(
            'VC_REGISTRY_ADDRESS',
        );
        if (!vcRegistryAddress) {
            throw new Error('VC_REGISTRY_ADDRESS not configured in .env');
        }

        this.logger.log(
            `Anchoring VC hash ${vcHash} on contract ${vcRegistryAddress}`,
        );

        try {
            const hash = await this.walletClient.writeContract({
                address: vcRegistryAddress,
                abi: vcRegistryAbi,
                functionName: 'anchorVC',
                args: [vcHash],
                account: this.issuerAccount,
                chain: anvil,
            });
            this.logger.log(`Transaction submitted with hash: ${hash}`);
            return hash;
        } catch (error) {
            this.logger.error('Failed to anchor VC on-chain', error);
            throw new Error('On-chain transaction failed.');
        }
    }
}

