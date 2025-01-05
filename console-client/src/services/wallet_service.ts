import axios from 'axios';
import { Wallet } from '../types/types';
import dotenv from 'dotenv';
dotenv.config();

export class WalletService {
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

    async getAllWallets(): Promise<Wallet[]> {
        try {
            const response = await axios.get(`${this.apiUrl}/api/wallets`);
            return response.data;
        } catch (error) {
            console.error('Tüm cüzdanlar alınırken hata oluştu:', error);
            throw error;
        }
    }

    async addWallet(wallet: Wallet): Promise<void> {
        try {
            await axios.post(`${this.apiUrl}/api/wallets`, wallet);
        } catch (error) {
            console.error('Cüzdan eklenirken hata oluştu:', error);
            throw error;
        }
    }
}
