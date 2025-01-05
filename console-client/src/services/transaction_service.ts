import axios from 'axios';
import { Wallet, Pool } from '../types/types';
import dotenv from 'dotenv';
dotenv.config();

export class TransactionService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = process.env.API_URL || ''; // .env dosyasından API URL'sini al
    }

    async swap(privateKey: string, poolId: string, token: string, amount: number): Promise<{ wallet: Wallet; pool: Pool }> {
        try {
            const response = await axios.post(`${this.apiUrl}/api/transactions/swap`, {
                privateKey,
                poolId,
                token,
                amount
            });

            return response.data;
        } catch (error) {
            console.error('Swap işlemi sırasında hata oluştu:', error);
            throw error;
        }
    }

    async addLiquidity(privateKey: string, poolId: string, token: string, amount: number): Promise<void> {
        try {
            await axios.post(`${this.apiUrl}/api/transactions/addliquidity`, {
                privateKey,
                poolId,
                token,
                amount
            });
        } catch (error) {
            console.error('Likidite ekleme işlemi sırasında hata oluştu:', error);
            throw error;
        }
    }
}
