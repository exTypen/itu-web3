
import { WalletService } from '../services/wallet_service';
import { Wallet } from '../types/types';

export class WalletManager {
    private walletService = new WalletService();
    async getWalletByPublicKey(publicKey: string) {
        return await this.walletService.getWalletByPublicKey(publicKey);
    }

    async getAllWallets() {
        return await this.walletService.getWallets();
    }

    async addWallet(wallet: Wallet) {
        return await this.walletService.addWallet(wallet);
    }
} 