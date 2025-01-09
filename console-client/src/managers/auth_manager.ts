import { WalletService } from '../services/wallet_service';
import { HashUtils } from '../utils/hash_utils';
import { Wallet } from '../types/types';
import { SignatureUtils } from '../utils/signature_utils';

class AuthManager {
  private loggedIn: boolean;
  private publicKey: string | null;
  private privateKey: string | null;
  constructor() {
    this.loggedIn = false;
    this.publicKey = null;
    this.privateKey = null;
  }

  async setWallet(privateKey: string): Promise<boolean> {
    const publicKey = SignatureUtils.getPublicKey(privateKey);

    this.loggedIn = true;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    return this.loggedIn;
  }

  disconnect(): void {
    this.loggedIn = false;
    this.publicKey = null;
    this.privateKey = null;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getPublicKey(): string | null {
    return this.publicKey;
  }

  getPrivateKey(): string | null {
    return this.privateKey;
  }
}

export default new AuthManager();
