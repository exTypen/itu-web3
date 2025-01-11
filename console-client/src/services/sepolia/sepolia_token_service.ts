import { ethers } from 'ethers';
import { Token } from '../../types/types';
import { ITokenService } from '../interfaces/token_service';
import dotenv from 'dotenv';
dotenv.config();

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)"
];

export class SepoliaTokenService implements ITokenService {
    private provider: ethers.Provider;
    
    constructor() {
        this.provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
    }

    async getTokenByAddress(address: string): Promise<Token> {
        try {
            const contract = new ethers.Contract(address, ERC20_ABI, this.provider);
            
            const [name, symbol] = await Promise.all([
                contract.name(),
                contract.symbol()
            ]);

            return {
                name,
                symbol
            };
        } catch (error) {
            throw new Error(`Token bilgileri alınamadı: ${address}`);
        }
    }
}
