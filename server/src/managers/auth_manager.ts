import walletService from "../services/wallet_service.js";
import HashUtils from "../utils/hash_utils.js";

class AuthManager {
  private loggedIn: boolean;
  private currentWallet: string | null;
  private privateKey: string | null;

  constructor() {
    this.loggedIn = false;
    this.currentWallet = null;
    this.privateKey = null;
  }

  async login(secretPhrase: string): Promise<boolean> {
    const privateKey = HashUtils.sha256(secretPhrase);
    const publicKey = HashUtils.sha256(privateKey);
    
    const wallet = await walletService.getWalletByPublicKey(publicKey);
    
    if (!wallet) {
      await walletService.addWallet({
        public_key: publicKey,
        balances: { 
          tokenA: 100, 
          tokenB: 100 
        }
      });
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