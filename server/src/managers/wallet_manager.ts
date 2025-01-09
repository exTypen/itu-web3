import { TokenService } from '../services/token_service';
import { TransactionService } from '../services/transaction_service';
import { WalletService } from '../services/wallet_service';
import { Wallet } from '../types/types';

export class WalletManager {
    private walletService = new WalletService();
    private transactionService = new TransactionService();
    private tokenService = new TokenService();

    async getWalletByPublicKey(publicKey: string) {
        const transactions = await this.transactionService.getTransactions();
        const wallet: Wallet = {
            public_key: publicKey,
            balances: {}
        };

        await Promise.all(transactions.map(async (transaction) => {
            const token = await this.tokenService.getTokenByAddress(transaction.token);
            
            if (!token) return;

            if (transaction.from === publicKey) {
                wallet.balances[token.symbol] = (wallet.balances[token.symbol] || 0) - transaction.amount;
            }
            if (transaction.to === publicKey) {
                wallet.balances[token.symbol] = (wallet.balances[token.symbol] || 0) + transaction.amount;
            }
        }));
        
        return wallet;
    }
} 