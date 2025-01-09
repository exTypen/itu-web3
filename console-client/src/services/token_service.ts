import axios from 'axios';
import { Token } from '../types/types';
import dotenv from 'dotenv';
dotenv.config();

export class TokenService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.API_URL || ''; // .env dosyasından API URL'sini al
  }

  async getTokenByAddress(address: string): Promise<Token> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/tokens/getbyaddress/${address}`);
      return response.data;
    } catch (error) {
      console.error(`Token ${address} alınırken hata oluştu:`, error);
      throw error;
    }
  }
}
