import { IPoolService } from '../services/interfaces/pool_service';
import { SepoliaPoolService } from '../services/concretes/sepolia/sepolia_pool_service';
import { FirebasePoolService } from '../services/concretes/firebase/firebase_pool_service';

import { ITokenService } from '../services/interfaces/token_service';
import { SepoliaTokenService } from '../services/concretes/sepolia/sepolia_token_service';
import { FirebaseTokenService } from '../services/concretes/firebase/firebase_token_service';

import { ITransactionService } from '../services/interfaces/transaction_service';
import { SepoliaTransactionService } from '../services/concretes/sepolia/sepolia_transaction_service';
import { FirebaseTransactionService } from '../services/concretes/firebase/firebase_transaction_service';

import { IWalletService } from '../services/interfaces/wallet_service';
import { FirebaseWalletService } from '../services/concretes/firebase/firebase_wallet_service';
import { SepoliaWalletService } from '../services/concretes/sepolia/sepolia_wallet_service';

class ServiceProvider {
  private static poolService: IPoolService;
  private static tokenService: ITokenService;
  private static transactionService: ITransactionService;
  private static walletService: IWalletService;
  private static chain: string;

  private static initializeServices() {
    if (this.chain === 'firebase') {
      this.poolService = new FirebasePoolService();
      this.tokenService = new FirebaseTokenService();
      this.transactionService = new FirebaseTransactionService();
      this.walletService = new FirebaseWalletService();
    } else if (this.chain === 'sepolia') {
      this.poolService = new SepoliaPoolService();
      this.tokenService = new SepoliaTokenService();
      this.transactionService = new SepoliaTransactionService();
      this.walletService = new SepoliaWalletService();
    }
  }

  static setChain(chain: string): void {
    this.chain = chain;
    this.initializeServices();
  }

  static getPoolService(): IPoolService {
    return this.poolService;
  }

  static getTokenService(): ITokenService {
    return this.tokenService;
  }

  static getTransactionService(): ITransactionService {
    return this.transactionService;
  }

  static getWalletService(): IWalletService {
    return this.walletService;
  }

  static getChain(): string {
    return this.chain;
  }
}
export default ServiceProvider;

