import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockchainService } from './blockchain/blockchain.service';
import { ConfigService } from '@nestjs/config';

describe('AppController', () => {
  let app: TestingModule; // <-- Declare 'app' here
  let appController: AppController;

  beforeEach(async () => {
    // Assign to the higher-scoped 'app' variable
    app = await Test.createTestingModule({
      controllers: [AppController],
      // We must provide mocks for all dependencies
      providers: [AppService, BlockchainService, ConfigService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return a string containing the Chain ID', async () => {
      // Mock the service method to avoid a real blockchain call in tests
      // 'app' is now accessible here
      const appService = app.get<AppService>(AppService);
      jest.spyOn(appService, 'getHello').mockResolvedValue('Hello from the Backend! Connected to Chain ID: 31337');

      // The test must now 'await' the result of the async function
      await expect(appController.getHello()).resolves.toContain('Connected to Chain ID');
    });
  });
});

