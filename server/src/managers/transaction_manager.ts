import { Transaction, Wallet } from '../types/types';
import { TransactionService } from '../services/transaction_service';
import { SignatureUtils } from '../utils/signature_utils';
import { WalletManager } from './wallet_manager';
import { PoolManager } from './pool_manager';
import { TokenManager } from './token_manager';
export class TransactionManager {
  private walletManager = new WalletManager();
  private poolManager = new PoolManager();
  private transactionService = new TransactionService();
  private tokenManager = new TokenManager();

  async getTransactions(): Promise<Transaction[]> {
    let transactions = await this.transactionService.getTransactions();
    return transactions;
  }

  async getTransactionByHash(transactionHash: string): Promise<Transaction | null> {
    return await this.transactionService.getTransactionByHash(transactionHash);
  }

  private async addTransaction(transaction: Transaction): Promise<boolean> {
    const txHash = '0x' + SignatureUtils.hashTransaction(transaction).toString('hex');
    await this.transactionService.createTransaction(transaction, txHash);
    return true;
  }
  async swap(transaction: Transaction, signature: string) {
    if (!signature) {
      throw {
        status: 400,
        message: 'İmza gerekli',
      };
    }
    const txHash = '0x' + SignatureUtils.hashTransaction(transaction).toString('hex');
    const verified = SignatureUtils.verifyTransaction(transaction, signature, transaction.from);
    if (!verified) {
      throw {
        status: 401,
        message: 'İmza doğrulaması başarısız',
      };
    }
    const wallet = await this.walletManager.getWalletByPublicKey(transaction.from);
    if (wallet!.balances[transaction.token] < transaction.amount) {
      throw {
        status: 400,
        message: 'Yetersiz bakiye',
      };
    }
    const pool = await this.poolManager.getPoolByAddress(transaction.to);
    if (!pool) {
      throw {
        status: 400,
        message: 'Pool not found',
      };
    }
    let targetToken = null;
    let selectedToken = null;
    if (pool.token1.address === transaction.token) {
      targetToken = pool.token2;
      selectedToken = pool.token1;
    } else if (pool.token2.address === transaction.token) {
      targetToken = pool.token1;
      selectedToken = pool.token2;
    }

    let targetTokenTempAmount = targetToken!.amount;
    selectedToken!.amount = selectedToken!.amount + transaction.amount;
    targetToken!.amount = pool.k / selectedToken!.amount;

    const receivedTokenAmount = targetTokenTempAmount - targetToken!.amount;

    let receivingTransaction: Transaction = {
      from: transaction.to,
      to: transaction.from,
      amount: receivedTokenAmount,
      token: targetToken!.address,
      type: 'swap',
      timestamp: new Date().getTime().toString(),
    };

    transaction.type = 'swap';

    if (pool.token1.address === transaction.token) {
      pool.token1 = selectedToken!;
    } else if (pool.token2.address === transaction.token) {
      pool.token2 = selectedToken!;
    }
    pool.k = pool.token1.amount * pool.token2.amount;

    await this.addTransaction(receivingTransaction);
    await this.poolManager.updatePool(pool, transaction.to);
    return await this.transactionService.createTransaction(transaction, txHash); 
  }

  async addLiquidity(transaction: Transaction, signature: string) {
    if (!signature) {
      throw {
        status: 400,
        message: 'İmza gerekli',
      };
    }
    const txHash = '0x' + SignatureUtils.hashTransaction(transaction).toString('hex');
    const verified = SignatureUtils.verifyTransaction(transaction, signature, transaction.from);
    if (!verified) {
      throw {
        status: 401,
        message: 'İmza doğrulaması başarısız',
      };
    }
    const wallet = await this.walletManager.getWalletByPublicKey(transaction.from);
    if (wallet!.balances[transaction.token] < transaction.amount) {
      throw {
        status: 400,
        message: 'Yetersiz bakiye',
      };
    }
    const pool = await this.poolManager.getPoolByAddress(transaction.to);
    if (!pool) {
      throw {
        status: 400,
        message: 'Pool not found',
      };
    }
    let otherTokenRequiredAmount = 0;
    let requiredTokenAddress = '';
    if (pool.token1.address === transaction.token) {
      otherTokenRequiredAmount = (pool.token2.amount / pool.token1.amount) * transaction.amount;
      pool.token1.amount = pool.token1.amount + transaction.amount;
      requiredTokenAddress = pool.token2.address;
    } else if (pool.token2.address === transaction.token) {
      otherTokenRequiredAmount = (pool.token1.amount / pool.token2.amount) * transaction.amount;
      pool.token2.amount = pool.token2.amount + transaction.amount;
      requiredTokenAddress = pool.token1.address;
    }
    const requiredToken = await this.tokenManager.getTokenByAddress(requiredTokenAddress);
    if (wallet!.balances[requiredToken!.symbol] < otherTokenRequiredAmount) {
      throw {
        status: 400,
        message: 'Yetersiz bakiye',
      };
    } else {
      let transactionToAddLiquidity: Transaction = {
        from: transaction.from,
        to: transaction.to,
        amount: otherTokenRequiredAmount,
        token: requiredTokenAddress,
        type: 'add_liquidity',
        timestamp: new Date().getTime().toString(),
      };

      transaction.type = 'add_liquidity';

      await this.addTransaction(transactionToAddLiquidity);
    }

    if (pool.token1.address === transaction.token) {
      pool.token2.amount = pool.token2.amount + otherTokenRequiredAmount;
    } else if (pool.token2.address === transaction.token) {
      pool.token1.amount = pool.token1.amount + otherTokenRequiredAmount;
    }

    pool.k = pool.token1.amount * pool.token2.amount;
    await this.poolManager.updatePool(pool, transaction.to);
    return await this.transactionService.createTransaction(transaction, txHash);
  }

  async signTransaction(transaction: Transaction, privateKey: string): Promise<string> {
    return SignatureUtils.signTransaction(transaction, privateKey);
  }
}
