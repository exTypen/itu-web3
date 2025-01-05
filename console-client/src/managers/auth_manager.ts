import { WalletService } from "../services/wallet_service";
import { HashUtils} from "../utils/hash_utils";
import { Wallet } from "../types/types";

class AuthManager {
  private loggedIn: boolean;
  private currentWallet: string | null;
  private privateKey: string | null;
  private walletService: WalletService;
  constructor() {
    this.loggedIn = false;
    this.currentWallet = null;
    this.privateKey = null;
    this.walletService = new WalletService();
  }

  async login(secretPhrase: string): Promise<boolean> {
    const privateKey = HashUtils.sha256(secretPhrase);
    const publicKey = HashUtils.sha256(privateKey);
    
    const wallet = await this.walletService.getWalletByPublicKey(publicKey);
    
    if (!wallet) {
      let wallet: Wallet = {
        public_key: publicKey,
        balances: { 
          tokenA: 100, 
          tokenB: 100 
        }
      }
      await this.walletService.addWallet(wallet);
    }

    this.loggedIn = true;
    this.currentWallet = publicKey;
    this.privateKey = privateKey;
    return this.loggedIn;
  }

  disconnect(): void {
    this.loggedIn = false;
    this.currentWallet = null;
    this.privateKey = null;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getCurrentWallet(): string | null {
    return this.currentWallet;
  }

  getPrivateKey(): string | null {
    return this.privateKey;
  }
}

export default new AuthManager();