import { IPoolService } from '../services/interfaces/pool_service';
import { SepoliaPoolService } from '../services/sepolia/sepolia_pool_service';
import { FirebasePoolService } from '../services/firebase/firebase_pool_service';

import { ITokenService } from '../services/interfaces/token_service';
import { SepoliaTokenService } from '../services/sepolia/sepolia_token_service';
import { FirebaseTokenService } from '../services/firebase/firebase_token_service';

import { ITransactionService } from '../services/interfaces/transaction_service';
import { SepoliaTransactionService } from '../services/sepolia/sepolia_transaction_service';
import { FirebaseTransactionService } from '../services/firebase/firebase_transaction_service';

import { IWalletService } from '../services/interfaces/wallet_service';
import { FirebaseWalletService } from '../services/firebase/firebase_wallet_service';
import { SepoliaWalletService } from '../services/sepolia/sepolia_wallet_service';

class ServiceProvider {
  private static poolService: IPoolService;
  private static tokenService: ITokenService;
  private static transactionService: ITransactionService;
  private static walletService: IWalletService;

  private static initializeServices(isFirebase: boolean) {
    if (isFirebase) {
      this.poolService = new FirebasePoolService();
      this.tokenService = new FirebaseTokenService();
      this.transactionService = new FirebaseTransactionService();
      this.walletService = new FirebaseWalletService();
    } else {
      this.poolService = new SepoliaPoolService();
      this.tokenService = new SepoliaTokenService();
      this.transactionService = new SepoliaTransactionService();
      this.walletService = new SepoliaWalletService();
    }
    // Buraya ileride başka servis sağlayıcıları eklenebilir (else if blokları ile)
  }

  static setServices(isFirebase: boolean): void {
    this.initializeServices(isFirebase);
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
}
export default ServiceProvider;

