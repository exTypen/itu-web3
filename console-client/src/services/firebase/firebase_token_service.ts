import axios from 'axios';
import { Token } from '../../types/types';
import dotenv from 'dotenv';
import { ITokenService } from '../interfaces/token_service';
dotenv.config();

export class FirebaseTokenService implements ITokenService {
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
