import axios from 'axios';
import { Transaction } from '../../../types/types';
import dotenv from 'dotenv';
import { ITransactionService } from '../../interfaces/transaction_service';
dotenv.config();

export class FirebaseTransactionService implements ITransactionService {
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

  async swap(body: any): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiUrl}/api/transactions/swap`, body);
      return response.data;
    } catch (error) {
      console.error('İşlem oluşturulurken hata oluştu:', error);
      throw error;
    }
  }

  async addLiquidity(body: any): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiUrl}/api/transactions/add_liquidity`, body);
      return response.data;
    } catch (error) {
      console.error('İşlem oluşturulurken hata oluştu:', error);
      throw error;
    }
  }
}
