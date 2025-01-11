import { ethers } from 'ethers';
import { Pool } from '../../types/types';
import { IPoolService } from '../interfaces/pool_service';
import { formatEther, formatUnits } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const POOL_ABI = [
    "function tokenA() view returns (address)",
    "function tokenB() view returns (address)",
    "function getReserves() view returns (uint256, uint256)",
];

const POOL_ADDRESS = process.env.SEPOLIA_POOL_ADDRESS;

export class SepoliaPoolService implements IPoolService {
    private provider: ethers.Provider;
    
    constructor() {
        this.provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
    }

    async getPools(): Promise<Pool[]> {
        const contract = new ethers.Contract(POOL_ADDRESS!, POOL_ABI, this.provider);
        
        const [tokenA, tokenB] = await Promise.all([
            contract.tokenA(),
            contract.tokenB()
        ]);
        
        const [reserveA, reserveB] = await contract.getReserves();
        
        const pool: Pool = {
            id: POOL_ADDRESS!,
            k: Number(formatUnits(reserveA, 6)) * Number(formatUnits(reserveB, 18)),
            token1: {
                address: tokenA,
                amount: Number(formatUnits(reserveA, 6))
            },
            token2: {
                address: tokenB,
                amount: Number(formatEther(reserveB))
            }
        };
        
        return [pool];
    }

    async getPoolById(poolId: string): Promise<Pool> {
        if (poolId.toLowerCase() !== POOL_ADDRESS!.toLowerCase()) {
            throw new Error('Pool not found');
        }
        
        const pools = await this.getPools();
        return pools[0];
    }
}
