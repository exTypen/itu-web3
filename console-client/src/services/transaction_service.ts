import axios from 'axios';
import { Wallet, Pool, Transaction } from '../types/types';
import dotenv from 'dotenv';
import auth_manager from '../managers/auth_manager';
import { SignatureUtils } from '../utils/signature_utils';
dotenv.config();

export class TransactionService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.API_URL || ''; // .env dosyasından API URL'sini al
  }

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/transactions/getall`);
      return response.data;
    } catch (error) {
      console.error('Tüm işlemler alınırken hata oluştu:', error);
      throw error;
    }
  }

  async getTransactionByHash(hash: string): Promise<Transaction> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/transactions/getbyhash/${hash}`);
      return response.data;
    } catch (error) {
      console.error('İşlem alınırken hata oluştu:', error);
      throw error;
    }
  }

  async createTransaction(body: any): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiUrl}/api/transactions/create`, body);
      return response.data;
    } catch (error) {
      console.error('İşlem oluşturulurken hata oluştu:', error);
      throw error;
    }
  }

  async addLiquidity(
    privateKey: string,
    poolId: string,
    token: string,
    amount: number
  ): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/api/transactions/addliquidity`, {
        privateKey,
        poolId,
        token,
        amount,
      });
    } catch (error) {
      console.error('Likidite ekleme işlemi sırasında hata oluştu:', error);
      throw error;
    }
  }
}
