import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockchainModule } from './blockchain/blockchain.module';
import { UserModule } from './user/user.module';
import { IssuerModule } from './issuer/issuer.module';
import { IpfsModule } from './ipfs/ipfs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    BlockchainModule,
    IssuerModule,
    IpfsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

