import axios from 'axios';
import { Pool } from '../types/types';
import dotenv from 'dotenv';
dotenv.config();

export class PoolService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = process.env.API_URL || ''; // .env dosyasından API URL'sini al
    }

    async getPools(): Promise<Pool[]> {
        try {
            const response = await axios.get(`${this.apiUrl}/api/pools`);
            return response.data;
        } catch (error) {
            console.error('Havuzları alırken hata oluştu:', error);
            throw error;
        }
    }

    async getPoolById(poolId: string): Promise<Pool> {
        try {
            const response = await axios.get(`${this.apiUrl}/api/pools/${poolId}`);
            return response.data;
        } catch (error) {
            console.error(`Havuz ${poolId} alınırken hata oluştu:`, error);
            throw error;
        }
    }
}
