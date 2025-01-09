import { FirebaseHelper } from "../utils/firebase_helper";
import { Transaction } from "../types/types";

export class TransactionService {
  private firebaseHelper = new FirebaseHelper();
  async getTransactions(): Promise<Transaction[]> {
    return await this.firebaseHelper.fetchDocs<Transaction>("transactions");
  }

  async getTransactionByHash(transactionHash: string): Promise<Transaction | null> {
    return await this.firebaseHelper.fetchDocByQuery<Transaction>("transactions", "id", transactionHash);
  }

  async createTransaction(transaction: Transaction, hash: string): Promise<boolean> {
    return await this.firebaseHelper.setDocument("transactions", transaction, hash);
  }
}
