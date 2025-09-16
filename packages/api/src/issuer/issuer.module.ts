import { Module } from '@nestjs/common';
import { IssuerService } from './issuer.service';
import { IssuerController } from './issuer.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { IpfsModule } from '../ipfs/ipfs.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    BlockchainModule,
    IpfsModule,
    UserModule,
  ],
  controllers: [IssuerController],
  providers: [IssuerService],
})
export class IssuerModule { }