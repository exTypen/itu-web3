import { FirebaseHelper } from '../utils/firebase_helper';
import { Wallet } from '../types/types';

export class WalletService {
  private firebaseHelper = new FirebaseHelper();
  public async getWallets(): Promise<Wallet[]> {
    return await this.firebaseHelper.fetchDocs<Wallet>('wallets');
  }

  async getWalletByPublicKey(publicKey: string): Promise<Wallet | null> {
    return await this.firebaseHelper.fetchDocByQuery<Wallet>('wallets', 'public_key', publicKey);
  }
}
