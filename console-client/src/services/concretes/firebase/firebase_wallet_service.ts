import axios from 'axios';
import { Wallet } from '../../../types/types';
import dotenv from 'dotenv';
import { IWalletService } from '../../interfaces/wallet_service';
dotenv.config();

export class FirebaseWalletService implements IWalletService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.API_URL || ''; // .env dosyasından API URL'sini al
  }

  async getWalletByPublicKey(publicKey: string): Promise<Wallet> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/wallets/${publicKey}`);
      return response.data;
    } catch (error) {
      console.error(`Cüzdan ${publicKey} alınırken hata oluştu:`, error);
      throw error;
    }
  }
}
