import { ethers } from 'ethers';
import { Token } from '../../types/types';
import { ITokenService } from '../interfaces/token_service';

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)"
];

export class SepoliaTokenService implements ITokenService {
    private provider: ethers.Provider;
    
    constructor() {
        this.provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/ca7d292e8ee143709e66cb9f47010744');
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
